from flask import Flask, request, jsonify, render_template
import os
from audio_processing import process_audio
from utils import evaluate_with_openai

import random
app = Flask(__name__)

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    
    audio_path = request.form.get('audio_path')
    name = request.form.get('name')
    tag = request.form.get('tag') # [('创新能力', '金色传说'), ('决策能力', '紫色稀有')]
    

    text = process_audio(audio_path)
    evaluation = evaluate_with_openai(name,tag,text)

    return jsonify({evaluation})

@app.route('/upload_audio1', methods=['POST'])
def upload_audio1():
    audio_file = request.files['audio']
    audio_path = os.path.join('./audio', request.form.get('name') )
    audio_file.save(audio_path)
    
    name = request.form.get('name')
    tag = request.form.get('tag') # [('创新能力', '金色传说'), ('决策能力', '紫色稀有')]
    

    text = process_audio(audio_path)
    evaluation = evaluate_with_openai(name,tag,text)
    print(evaluation)
    return jsonify(evaluation)

# 定义标签分类及其对应的稀有度
tags = {
    "金色传说": ['创新能力', '情绪管理', '危机处理', '战略思维'],
    "紫色稀有": ['领导能力', '决策能力', '资源优化', '项目管理'],
    "绿色超凡": ['团队合作', '工作效率', '责任感', '执行力'],
    "白色普通": ['时间管理', '自我改进', '学习能力', '问题解决','纪律性', '沟通能力', '反馈能力', '任务完成']
}

# 为每个标签类别设置出现概率（稀有度越高，出现概率越低）
probabilities = {
    "金色传说": 0.05,  # 5% 的概率
    "紫色稀有": 0.1,   # 10% 的概率
    "绿色超凡": 0.3,   # 10% 的概率
    "白色普通": 0.55,  # 25% 的概率
}

@app.route('/sample_tags', methods=['GET'])
def sample_tags():
    num_tags = int(request.args.get('num_tags', 10))
    sampled_tags = []
    # 复制 tags 字典，避免修改原始数据
    available_tags = {rarity: list(t_list) for rarity, t_list in tags.items()}
    
    while len(sampled_tags) < num_tags:
        # 根据当前可选稀有度标签的权重采样
        rarities = list(available_tags.keys())
        # 如果某个稀有度下已经没有标签了，可以将其权重置为 0 或从列表中移除
        weights = [probabilities[r] if available_tags[r] else 0 for r in rarities]
        if sum(weights) == 0:
            break  # 当所有稀有度下均无可用标签时退出循环
        rarity = random.choices(rarities, weights=weights, k=1)[0]
        
        # 从该稀有度列表中随机选择一个标签，并移除该标签
        tag = random.choice(available_tags[rarity])
        available_tags[rarity].remove(tag)
        
        rarity_key = rarity[:-2]  # 去掉“传说”、“稀有”、“超凡”、“普通”字样
        tag_str = f"{tag} ({rarity}, {int(probabilities[rarity]*100)}%)"
        sampled_tags.append({"tag": tag_str, "rarity": rarity_key})
    
    return jsonify(sampled_tags)



@app.route('/')
def index():
    return render_template('index.html')  # 渲染 index.html 文件
# # 假设生成 10 个标签
# sampled_tags = sample_tags(10)
# for tag, rarity in sampled_tags:
#     print(f"标签: {tag}, 稀有度: {rarity}")



if __name__ == '__main__':
    app.run(debug=True)
