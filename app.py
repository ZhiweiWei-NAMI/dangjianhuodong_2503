from flask import Flask, request, jsonify, render_template
import os
from audio_processing import process_audio
from utils import evaluate_with_openai

import random
app = Flask(__name__)

@app.route('/upload_audio', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    audio_file = request.files['audio']
    audio_path = os.path.join('uploads', audio_file.filename)
    audio_file.save(audio_path)

    text = process_audio(audio_path)
    evaluation = evaluate_with_openai(text)

    return jsonify({'text': text, 'evaluation': evaluation})

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
    num_tags = int(request.args.get('num_tags', 10))  # 从请求中获取标签数量，默认为10
    sampled_tags = []
    for _ in range(num_tags):
        # 根据稀有度进行分类采样，不允许重复，要设置replace=False
        rarity = random.choices(list(tags.keys()), weights=probabilities.values(), k=1)[0]
        rarity_key = rarity[:-2]  # 去掉“传说”、“稀有”、“超凡”、“普通”字样
        tag = random.choice(tags[rarity])
        # 添加颜色和概率 (%)
        tag = f"{tag} ({rarity}, {int(probabilities[rarity]*100)}%)"
        sampled_tags.append({"tag": tag, "rarity": rarity_key})  # 返回的标签包含tag和rarity字段
    
    return jsonify(sampled_tags)  # 返回JSON格式的标签数据

@app.route('/')
def index():
    return render_template('index.html')  # 渲染 index.html 文件
# # 假设生成 10 个标签
# sampled_tags = sample_tags(10)
# for tag, rarity in sampled_tags:
#     print(f"标签: {tag}, 稀有度: {rarity}")



if __name__ == '__main__':
    app.run(debug=True)
