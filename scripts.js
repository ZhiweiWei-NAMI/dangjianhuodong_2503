let mediaRecorder;
let audioChunks = [];

document.getElementById('generateTagsButton').addEventListener('click', function () {
    const numMembers = document.getElementById('numMembers').value;
    generateTags(numMembers);
});

document.getElementById('startRecording').addEventListener('click', startRecording);
document.getElementById('submitRecording').addEventListener('click', submitRecording);

function generateTags(numMembers) {
    // 向后端请求生成标签
    fetch(`/sample_tags?num_tags=${numMembers * 2}`)
        .then(response => response.json())
        .then(tags => {
            const tagsList = document.getElementById('tagsList');
            tagsList.innerHTML = '';  // 清空现有的标签列表

            // 根据稀有度分类并应用颜色
            tags.forEach(tagData => {
                const li = document.createElement('li');
                li.className = 'list-group-item tag-item';
                li.textContent = tagData.tag;

                // 根据 rarity 字段为标签应用不同的颜色
                switch(tagData.rarity) {
                    case '金色':
                        li.classList.add('tag-gold');
                        break;
                    case '紫色':
                        li.classList.add('tag-purple');
                        break;
                    case '绿色':
                        li.classList.add('tag-green');
                        break;
                    case '白色':
                        li.classList.add('tag-white');
                        break;
                    case '灰色':
                        li.classList.add('tag-gray');
                        break;
                }
                tagsList.appendChild(li);
            });

            setupMemberTags(numMembers, tags);
        })
        .catch(error => {
            console.error('Error fetching tags:', error);
            alert('无法获取标签，请确保后端运行。');
        });
}

function setupMemberTags(numMembers, tags) {
    const memberTagsDiv = document.getElementById('memberTags');
    memberTagsDiv.innerHTML = '';  // 清空现有成员标签

    for (let i = 1; i <= numMembers; i++) {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'd-flex align-items-center mb-3 member-tag-entry';
        memberDiv.innerHTML = `
            <div class="me-3">
                <label for="member${i}" class="form-label">成员${i}:</label>
                <input type="text" id="member${i}" name="member${i}" class="form-control form-control-lg">
            </div>
            <div>
                <label for="member${i}Tags" class="form-label">选择标签:</label>
                <select id="member${i}Tags" class="form-select form-select-lg">
                    ${tags.map(tagData => `<option value="${tagData.tag}">${tagData.tag}</option>`).join('')}
                </select>
            </div>
        `;
        memberTagsDiv.appendChild(memberDiv);
    }
}

// 录音功能
function startRecording() {
    audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                document.getElementById('audioPlayer').src = audioUrl;
            };

            mediaRecorder.start();
            document.getElementById('startRecording').textContent = '录音中...';
            document.getElementById('startRecording').classList.add('btn-warning');
            document.getElementById('startRecording').disabled = true;
            document.getElementById('submitRecording').disabled = false;
        })
        .catch(error => {
            console.error('录音失败:', error);
            alert('无法访问麦克风，请检查权限设置。');
        });
}

// 提交录音
function submitRecording() {
    mediaRecorder.stop();
    document.getElementById('startRecording').textContent = '开始录音';
    document.getElementById('startRecording').classList.remove('btn-warning');
    document.getElementById('startRecording').disabled = false;
    document.getElementById('submitRecording').disabled = true;

    // 使用 FormData 发送音频数据
    const formData = new FormData();
    formData.append('audio', new Blob(audioChunks, { type: 'audio/wav' }));

    fetch('/upload_audio', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Text:', data.text);
        console.log('Evaluation:', data.evaluation);
    })
    .catch(error => {
        console.error('上传失败:', error);
        alert('提交录音时出错，请重试。');
    });
}
