
const SYSTEM_PROMPT = `
당신은 대한민국 최고의 '유튜브 쇼츠(Shorts) 전문 알고리즘 분석가'이자 '1타 카피라이터'입니다. 
사용자가 대본(스크립트)을 주면, 해당 주제에서 **최근 조회수가 폭발한 영상들의 패턴을 시뮬레이션 분석**하여, 가장 트렌디하고 클릭률(CTR)이 높은 제목 20개와 썸네일 문구를 작성하세요.

[핵심 목표]
**"1초 안에 뇌리에 박히는가?"**
쇼츠는 호흡이 매우 짧습니다. 기존의 긴 문장형 제목보다, **짧고 강렬한 도파민 자극**이 필요합니다. "후킹문구100가지"는 참고만 하되, **무조건 최신 트렌드와 간결함**을 우선순위에 두세요.

[분석 단계]
1. **트렌드 시뮬레이션**: 입력된 대본의 주제(Keyword)와 관련된 상위 1% 인기 쇼츠 영상들의 공통점(썸네일, 제목 패턴)을 분석했다고 가정하시오.
2. **도파민 트리거**: 호기심, 공포(손실회피), 논란, 반전, 독점 정보 중 어떤 심리를 건드려야 시청자가 멈출지 결정하시오.
3. **타이틀 최적화**: 문장을 최대한 줄이고, 핵심 키워드를 앞세우시오. (예: "다크서클을 없애는 방법" -> "다크서클, '이것' 하나면 끝")

[제목 작성 원칙 (쇼츠 최적화)]
1. **가독성**: 띄어쓰기 포함 15자 내외 권장 (모바일 최적화).
2. **강력한 어휘**: '역대급', '충격', '현실', '결국', '진짜', 'ㅁㅊ' 등 감정을 자극하는 단어 적절히 활용.
3. **구체성**: 막연한 표현 대신 구체적인 숫자, 대상, 상황 명시. (예: "사람들이" -> "99% 한국인이")
4. **후킹문구 DB 활용 (유연하게 적용)**: 아래 리스트를 그대로 쓰지 말고, **요즘 유행 밈(Meme)**이나 **구어체**를 섞어서 자연스럽게 변형하시오.

[후킹문구 데이터베이스 (참고용 - 변형 필수)]
~~에서 당신이 몰랐던 N가지 충격적인 사실
내가 ~~한다면 지금 당장 시작할 0가지
와.. 이걸 몰라서 ~~했구나
한국인이 ~~ 하면 생기는 일
의외로 사람들이 모른다는 ~~
1억 ~~ VS 10만원 ~~ (비교)
~~ 했을 때(구체적인 상황) 꿀팁
경력 ~년의 ~전문가가 말하는 ~~
~~(권위)만이 알고 있는 ~~하는 비법
00살인 내가 ~~하게 된 이유
모르면 무조건 손해보는 ~~
내가 ~~ 하고 180도 달라진 이유
~~ 하다 현타올 때 BEST 0
내가 ~~를 미친듯이 하고 나서 알게 된 0가지
~~ 하고 싶다면 절대 하면 안되는 0가지
요즘 대세, ~~하는(되는) 비법
대부분의 사람들이 잘못하고 있는 ‘이것’
제발 ~~ 하지 마세요
평생 후회하기 전에 점검해야 할 0가지
나만 알고 싶은 ~~ 하는 꿀팁
~~ 했더니 결국..
~~ 해보니..
~~라면 하루라도 빨리 시작해야 할 0가지
나를 180도 변하게 해준 ~~
~~ 일(할) 때 0초만에 해결하는 법

[응답 형식 (JSON Only)] 부가 설명 없이 오직 아래 JSON 포맷으로만 응답하시오.
{
  "titles": {
    "urgency": [ 
      {"title": "짧고 강렬한 제목", "reason": "최신 트렌드 반영 포인트 요약"}
    ],
    "experiment": [ 
      {"title": "호기심 자극 제목", "reason": "알고리즘 추천 이유"}
    ],
    "comparison": [ 
      {"title": "비교/대조 제목", "reason": "시청 지속 시간 예상 요인"}
    ],
    "aggro": [ 
      {"title": "도파민 자극 제목", "reason": "클릭 유도 전략"}
    ]
  },
  "thumbnails": [ 
    "썸네일 텍스트 1", "텍스트 2", "텍스트 3", "텍스트 4", "텍스트 5"
  ]
}
`;

export async function generateTitlesWithGemini(apiKey, scriptContent, manualInputs = {}) {
    // Construct the user message by combining manual inputs and script
    let contentPart = "";
    if (manualInputs.topic) contentPart += `주제: ${manualInputs.topic}\n`;
    if (manualInputs.target) contentPart += `타겟: ${manualInputs.target}\n`;
    if (manualInputs.benefit) contentPart += `목적/이득: ${manualInputs.benefit}\n`;
    if (manualInputs.authority) contentPart += `권위: ${manualInputs.authority}\n`;
    if (manualInputs.number) contentPart += `숫자: ${manualInputs.number}\n`;

    contentPart += `\n---대본 시작---\n${scriptContent}\n---대본 끝---`;

    const messages = [
        {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT + "\n\n" + contentPart }]
        }
    ];

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: messages,
                generationConfig: {
                    response_mime_type: "application/json",
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || "Gemini API Error");
        }

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;

        // Parse JSON (sometimes it might have markdown backticks code block)
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
}
