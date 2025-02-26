import openai

def evaluate_with_openai(text):
    openai.api_key = 'YOUR_API_KEY'

    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"请根据以下内容对与民主评议主题的吻合程度进行评分：\n{text}",
        max_tokens=150
    )

    return response.choices[0].text.strip()
