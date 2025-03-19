document.addEventListener('DOMContentLoaded', function () {
    // 小组数据
    // 葛蕾：孟璟陆，孙亦菲，王姝谕，陈一洋，雷扬，赵紫君，张唯琛 
    // 从玉琪：王亮淇，李松泽，宋子阳，原笑阳，王旭飞，李紫萌 
    // 范虹霖：沈卓成，罗浩鸣，王悦晖，张安琦，田宇潇，李天昊 
    // 孙韩雅：刘潇，赵一婷，杨明月，陈雨彤，汪钟毓，王宇莹 
    // 魏智伟：沙坚，傅佳恒，张艺博，张耀华，汤可娴，陈嘉瑞，王奕博
    const groups = [
        {
            leader: "葛蕾",
            members: ["孟璟陆", "孙亦菲", "王姝谕", "陈一洋", "雷扬", "赵紫君", "张唯琛"]
        },
        {
            leader: "从玉琪",
            members: ["王亮淇", "李松泽", "宋子阳", "原笑阳", "王旭飞", "李紫萌"]
        },
        {
            leader: "范虹霖",
            members: ["沈卓成", "罗浩鸣", "王悦晖", "张安琦", "田宇潇", "李天昊"]
        },
        {
            leader: "孙韩雅",
            members: ["刘潇", "赵一婷", "杨明月", "陈雨彤", "汪钟毓", "王宇莹"]
        },
        {
            leader: "魏智伟",
            members: ["沙坚", "傅佳恒", "张艺博", "张耀华", "汤可娴", "陈嘉瑞", "王奕博"]
        }
    ];

    // 当前选中的小组和成员
    let currentGroup = null;
    let selectedMember = null;

    // 渲染小组按钮
    function renderGroupButtons() {
        const groupButtonsContainer = document.getElementById('groupButtons');
        groupButtonsContainer.innerHTML = '';

        groups.forEach(group => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-danger', 'btn-lg', 'group-btn');
            button.textContent = group.leader + '小组';
            button.addEventListener('click', () => selectGroup(group));
            groupButtonsContainer.appendChild(button);
        });
    }

    // 选择小组
    function selectGroup(group) {
        // 更新按钮状态
        document.querySelectorAll('.group-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === group.leader + '小组') {
                btn.classList.add('active');
            }
        });

        currentGroup = group;
        document.getElementById('currentGroupName').textContent = group.leader + '小组成员';
        selectedMember = null;
        renderMembers();
    }

    // 渲染成员列表
    function renderMembers() {
        const membersContainer = document.getElementById('membersList');
        membersContainer.innerHTML = '';

        if (!currentGroup) return;

        // 添加组长
        const leaderCard = createMemberCard(currentGroup.leader, true);
        membersContainer.appendChild(leaderCard);

        // 添加组员
        currentGroup.members.forEach(member => {
            const memberCard = createMemberCard(member, false);
            membersContainer.appendChild(memberCard);
        });
    }

    // 创建成员卡片
    function createMemberCard(name, isLeader) {
        const col = document.createElement('div');
        col.classList.add('col-md-6', 'mb-3');

        const card = document.createElement('div');
        card.classList.add('card', 'member-card');
        card.dataset.name = name;

        card.addEventListener('click', () => {
            document.querySelectorAll('.member-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedMember = name;
        });

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.innerHTML = `${name} ${isLeader ? '<span class="badge bg-danger">组长</span>' : ''}`;

        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('assigned-tags', 'mt-2');
        tagsContainer.id = `tags-${name.replace(/\s+/g, '-')}`;

        cardBody.appendChild(title);
        cardBody.appendChild(tagsContainer);
        card.appendChild(cardBody);
        col.appendChild(card);

        return col;
    }

    // 生成标签
    document.getElementById('generateTags').addEventListener('click', function () {
        // 模拟从后端获取标签
        fetch('/sample_tags?num_tags=10')
            .then(response => response.json())
            .then(tags => {
                const processedTags = tags.map(tagObj => {
                    const idx = tagObj.tag.indexOf('(');
                    if (idx !== -1) {
                        // 只保留左括号之前的内容，并去掉前后空格
                        tagObj.tag = tagObj.tag.substring(0, idx).trim();
                    }
                    return tagObj;
                });
                renderTags(processedTags);
            })
            .catch(error => {
                console.error('Error fetching tags:', error);
                // 使用模拟数据进行测试
                const mockTags = [
                    { tag: "创新能力 (金色传说, 5%)", rarity: "金色" },
                    { tag: "战略思维 (金色传说, 5%)", rarity: "金色" },
                    { tag: "领导能力 (紫色稀有, 10%)", rarity: "紫色" },
                    { tag: "决策能力 (紫色稀有, 10%)", rarity: "紫色" },
                    { tag: "团队合作 (绿色超凡, 30%)", rarity: "绿色" },
                    { tag: "执行力 (绿色超凡, 30%)", rarity: "绿色" },
                    { tag: "责任感 (绿色超凡, 30%)", rarity: "绿色" },
                    { tag: "沟通能力 (白色普通, 55%)", rarity: "白色" },
                    { tag: "时间管理 (白色普通, 55%)", rarity: "白色" },
                    { tag: "学习能力 (白色普通, 55%)", rarity: "白色" }
                ];
                renderTags(mockTags);
            });
    });

    // 渲染标签
    function renderTags(tags) {
        const tagsContainer = document.getElementById('tagsPool');
        tagsContainer.innerHTML = '';

        tags.forEach(tagData => {
            const tagElem = document.createElement('span');
            tagElem.classList.add('tag-badge', `tag-${tagData.rarity}`);
            tagElem.textContent = tagData.tag;
            tagElem.dataset.tag = tagData.tag;
            tagElem.dataset.rarity = tagData.rarity;

            tagElem.addEventListener('click', function () {
                if (selectedMember) {
                    assignTagToMember(selectedMember, tagData);
                    // 移除标签
                    tagElem.remove();
                } else {
                    alert('请先选择一名组员');
                }
            });

            tagsContainer.appendChild(tagElem);
        });
    }

    // 将标签分配给成员
    function assignTagToMember(memberName, tagData) {
        const memberTagsContainer = document.getElementById(`tags-${memberName.replace(/\s+/g, '-')}`);

        // 检查成员已经分配的标签数量
        if (memberTagsContainer.children.length >= 2) {
            alert(`${memberName} 已经分配了2个标签，无法再添加更多`);
            return;
        }

        const tagElem = document.createElement('span');
        tagElem.classList.add('assigned-tag', `tag-${tagData.rarity}`);
        tagElem.textContent = tagData.tag;
        tagElem.rarity = tagData.rarity;

        memberTagsContainer.appendChild(tagElem);
    }

    function getMemberTags(memberName) {
        // 根据成员名称获取标签容器
        const memberTagsContainer = document.getElementById(`tags-${memberName.replace(/\s+/g, '-')}`);
        if (!memberTagsContainer) {
            console.error(`找不到 ${memberName} 的标签容器`);
            return [];
        }
        // 遍历所有子元素，解析文本内容，生成二元组： [tagName, rarityString]
        const tags = Array.from(memberTagsContainer.children).map(tagElem => {
            const fullText = tagElem.textContent.trim();
            let tagName = fullText;
            let rarityString = "";
            // 如果包含括号，则解析括号前的内容为标签名称，括号内逗号前的为稀有度
            if (fullText.indexOf("(") !== -1) {
                tagName = fullText.substring(0, fullText.indexOf("(")).trim();
                const start = fullText.indexOf("(") + 1;
                const commaIndex = fullText.indexOf(",", start);
                if (commaIndex !== -1) {
                    rarityString = fullText.substring(start, commaIndex).trim();
                } else {
                    // 如果没有逗号，则取括号内全部内容
                    rarityString = fullText.substring(start, fullText.indexOf(")")).trim();
                }
            }
            return [tagName, rarityString];
        });
        return tags;
    }

    // 录音功能
    const recordButton = document.getElementById('recordButton');
    const audioPlayback = document.getElementById('audioPlayback');
    const progressBar = document.getElementById('recordingProgress');
    let mediaRecorder;
    let chunks = [];
    let isRecording = false;
    let progressInterval;

    recordButton.addEventListener('click', toggleRecording);

    function toggleRecording() {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    function startRecording() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();
                    isRecording = true;

                    recordButton.innerHTML = '<i class="fas fa-stop"></i>';
                    recordButton.classList.add('btn-warning');
                    recordButton.classList.remove('btn-danger');

                    chunks = [];
                    mediaRecorder.ondataavailable = e => chunks.push(e.data);
                    mediaRecorder.onstop = createAudioPreview;

                    // 模拟进度条
                    let progress = 0;
                    progressBar.style.width = '0%';
                    progressInterval = setInterval(() => {
                        progress += 1;
                        if (progress <= 100) {
                            progressBar.style.width = progress + '%';
                        } else {
                            clearInterval(progressInterval);
                        }
                    }, 300);
                })
                .catch(err => {
                    console.error('录音失败:', err);
                    alert('无法访问麦克风，请检查浏览器权限设置。');
                });
        } else {
            alert('您的浏览器不支持录音功能。');
        }
    }

    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;

            recordButton.innerHTML = '<i class="fas fa-microphone"></i>';
            recordButton.classList.add('btn-danger');
            recordButton.classList.remove('btn-warning');

            clearInterval(progressInterval);
            progressBar.style.width = '100%';

            // 关闭麦克风
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }

    function createAudioPreview() {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(blob);
        console.log(audioURL)
        audioPlayback.src = audioURL;
        audioPlayback.controls = true;
    }

    let evaluationData = ""
    // 提交录音
    document.getElementById('submitRecording').addEventListener('click', function () {
        if (chunks.length === 0) {
            alert('请先录制语音');
            return;
        }

        if (!selectedMember) {
            alert('请选择一名组员进行评价');
            return;
        }

        // 这里可以添加实际的提交逻辑
        mediaRecorder.stop();
        // document.getElementById('startRecording').textContent = '开始录音';
        // document.getElementById('startRecording').classList.remove('btn-warning');
        // document.getElementById('startRecording').disabled = false;
        document.getElementById('submitRecording').disabled = true;
        evaluationData = "";
        // 使用 FormData 发送音频数据
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(blob);
        const tags = getMemberTags(selectedMember);
        console.log(tags);
        let formData = new FormData()
        formData.append('audio', new Blob(chunks, { type: 'audio/wav' }));
        //formData.append('audio_path', audioURL)
        formData.append('tag', tags);
        formData.append('name', selectedMember)

        fetch('/upload_audio1', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Text:', data.text);
                console.log('Evaluation:', data.evaluation);
                //evaluation
                evaluationData = data;
            })
            .catch(error => {
                console.error('上传失败:', error);
                alert('提交录音时出错，请重试。');
            });

        alert(`${selectedMember} 的语音评价已提交！`);
    });

    // 初始化
    renderGroupButtons();

    // 为按钮添加点击事件监听
    document.getElementById("evaluation-section__btn--evaluation").addEventListener("click", function () {
        const evaluationBox = document.getElementById("evaluation-box");
        evaluationBox.innerHTML = "";  // 清空之前的内容

        // 创建加载中的转圈动画元素（此处使用 Font Awesome 的 spinner 图标，需要引入 Font Awesome）
        const spinner = document.createElement("div");
        spinner.className = "spinner";  // 可通过 CSS 自定义 spinner 样式
        spinner.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 思考中...';
        evaluationBox.appendChild(spinner);

        // 记录开始时间，并设置超时时间为 2 分钟（120000 毫秒）
        const startTime = Date.now();
        const timeout = 60000;  // 1 分钟

        // 定时检测文本是否已生成
        const checkInterval = setInterval(function () {
            // 当 evaluationData 存在且 evaluationData.evaluation 有值时，认为文本生成完毕
            if (evaluationData && evaluationData.evaluation) {
                clearInterval(checkInterval);
                // 移除加载动画
                evaluationBox.innerHTML = "";

                const text = evaluationData.evaluation;
                let currentIndex = 0;

                // 使用 setInterval 逐字显示文本，间隔 50 毫秒显示一个字符
                const printInterval = setInterval(function () {
                    evaluationBox.innerHTML += text.charAt(currentIndex);
                    currentIndex++;
                    if (currentIndex >= text.length) {
                        clearInterval(printInterval);
                        document.getElementById('submitRecording').disabled = false;
                    }
                }, 50); // 每个字符间隔 50 毫秒，根据需要可调整速度
            } else {
                // 检查是否超过 2 分钟
                if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    evaluationBox.innerHTML = "服务器繁忙，请稍后重试";
                    document.getElementById('submitRecording').disabled = false;
                }
            }
        }, 100); // 每 100 毫秒检测一次
    });

    // 为按钮添加点击事件监听
    document.getElementById("evaluation-section__btn--sharp-comment").addEventListener("click", function () {
        const evaluationBox = document.getElementById("sharp-comment-box");
        evaluationBox.innerHTML = "";  // 清空之前的内容

        // 创建加载中的转圈动画元素（此处使用 Font Awesome 的 spinner 图标，需要引入 Font Awesome）
        const spinner = document.createElement("div");
        spinner.className = "spinner";  // 可通过 CSS 自定义 spinner 样式
        spinner.innerHTML = '<i class="fa fa-spinner fa-spin"></i> 思考中...';
        evaluationBox.appendChild(spinner);

        // 记录开始时间，并设置超时时间为 2 分钟（120000 毫秒）
        const startTime = Date.now();
        const timeout = 60000;  // 1 分钟

        // 定时检测文本是否已生成
        const checkInterval = setInterval(function () {
            // 当 evaluationData 存在且 evaluationData.evaluation 有值时，认为文本生成完毕
            if (evaluationData && evaluationData.sharp_comment) {
                clearInterval(checkInterval);
                // 移除加载动画
                evaluationBox.innerHTML = "";

                const text = evaluationData.sharp_comment;
                let currentIndex = 0;

                // 使用 setInterval 逐字显示文本，间隔 50 毫秒显示一个字符
                const printInterval = setInterval(function () {
                    evaluationBox.innerHTML += text.charAt(currentIndex);
                    currentIndex++;
                    if (currentIndex >= text.length) {
                        clearInterval(printInterval);
                        document.getElementById('submitRecording').disabled = false;
                    }
                }, 50); // 每个字符间隔 50 毫秒，根据需要可调整速度
            } else {
                // 检查是否超过 2 分钟
                if (Date.now() - startTime > timeout) {
                    clearInterval(checkInterval);
                    evaluationBox.innerHTML = "服务器繁忙，请稍后重试";
                    document.getElementById('submitRecording').disabled = false;
                }
            }
        }, 100); // 每 100 毫秒检测一次
    });
});