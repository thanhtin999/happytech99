/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Lesson,
  Material,
  ReadingText,
  Quiz,
  Assignment,
  Exam,
  Student,
  QuestionBankItem,
  CreativeProduct,
  Account
} from './types';

// Helper to load from LocalStorage or fallback to default
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
}

// 1. CHƯƠNG TRÌNH HỌC (Lessons)
export const initialLessons: Lesson[] = [
  {
    id: 'L001',
    title: 'Làm quen với trí tuệ nhân tạo trong học tập',
    subject: 'Tin học / Năng lực số',
    grade: 'Lớp 6',
    semester: 'I',
    objective: 'Giúp học sinh hiểu khái niệm cơ bản về AI, phân biệt được trí tuệ nhân tạo và chương trình máy tính thông thường, biết cách áp dụng AI an toàn vào học tập.',
    duration: '2 tiết (90 phút)',
    week: 1,
    status: 'Đã hoàn thành'
  },
  {
    id: 'L002',
    title: 'Tạo video bài giảng bằng AI',
    subject: 'Kỹ năng số & Sáng tạo',
    grade: 'Lớp 6',
    semester: 'I',
    objective: 'Học sinh biết viết kịch bản, sử dụng các công cụ AI miễn phí tạo MC ảo, ghép âm thanh và biên tập một video bài giảng ngắn 24 giây.',
    duration: '2 tiết (90 phút)',
    week: 2,
    status: 'Đang dạy'
  },
  {
    id: 'L003',
    title: 'Thiết kế game học tập bằng AI',
    subject: 'Tin học / Trải nghiệm sáng tạo',
    grade: 'Lớp 6',
    semester: 'I',
    objective: 'Ứng dụng AI để thiết kế các câu đố, trò chơi tương tác như câu cá chữ, đuổi hình bắt chữ để ôn luyện kiến thức các môn học.',
    duration: '2 tiết (90 phút)',
    week: 3,
    status: 'Chưa dạy'
  },
  {
    id: 'L004',
    title: 'Xây dựng web app giáo dục bằng AI',
    subject: 'Lập trình ứng dụng',
    grade: 'Lớp 7',
    semester: 'II',
    objective: 'Hướng dẫn học sinh từng bước lên ý tưởng, thiết kế giao diện và sử dụng AI hỗ trợ viết mã nguồn HTML/JS tạo ứng dụng học tập đơn giản.',
    duration: '3 tiết (135 phút)',
    week: 12,
    status: 'Chưa dạy'
  }
];

// 2. KHO HỌC LIỆU (Materials)
export const initialMaterials: Material[] = [
  {
    id: 'M001',
    title: 'Tạo game câu cá chữ bằng AI',
    type: 'Video bài giảng',
    size: '45MB',
    description: 'Hướng dẫn chi tiết cách dùng các nền tảng AI tạo hình ảnh cá, sinh câu hỏi và tích hợp vào game tương tác trên PowerPoint/Web.',
    grade: 'Lớp 6',
    subject: 'Tin học',
    createdAt: '2026-06-10'
  },
  {
    id: 'M002',
    title: 'Ứng dụng AI trong dạy học',
    type: 'Bài giảng Slide',
    size: '12MB',
    description: 'Bộ slide toàn diện giới thiệu các công cụ AI hỗ trợ giáo viên soạn giáo án, tạo đề thi tự động và chấm điểm thông minh.',
    grade: 'Lớp 10',
    subject: 'Phương pháp dạy học',
    createdAt: '2026-06-12'
  },
  {
    id: 'M003',
    title: 'Khám phá năng lực số của học sinh',
    type: 'Phiếu học tập',
    size: '1.5MB',
    description: 'Phiếu khảo sát và đánh giá năng lực công nghệ thông tin dành cho học sinh đầu cấp học, giúp giáo viên phân hóa bài giảng.',
    grade: 'Lớp 6',
    subject: 'Hoạt động trải nghiệm',
    createdAt: '2026-06-15'
  },
  {
    id: 'M004',
    title: 'Quy trình tạo video AI 3 cảnh',
    type: 'Sơ đồ tư duy',
    size: '4.2MB',
    description: 'Bản đồ trực quan từng bước: 1. Viết kịch bản bằng prompt, 2. Sinh giọng đọc & MC ảo, 3. Biên tập và chèn hiệu ứng.',
    grade: 'Lớp 7',
    subject: 'Mỹ thuật số',
    createdAt: '2026-06-18'
  },
  {
    id: 'M005',
    title: 'Tạo video bài giảng 24 giây',
    type: 'Prompt AI',
    size: '200KB',
    description: 'Tổng hợp các câu lệnh (prompts) chuẩn để ra lệnh cho AI viết kịch bản chặt chẽ, tối ưu thời gian 24 giây cho các video ngắn.',
    grade: 'Lớp 6',
    subject: 'Năng lực số',
    createdAt: '2026-06-20'
  }
];

// 3. THỰC HÀNH ĐỌC (Reading Texts)
export const initialReadingTexts: ReadingText[] = [
  {
    id: 'R001',
    title: 'Mùa thu và hương cốm ngõ nhỏ',
    genre: 'Tản văn',
    topic: 'Văn học & Cảm xúc',
    shortDesc: 'Một đoạn tản văn nhẹ nhàng về tiết trời thu Hà Nội, mùi lá sen già quyện hương cốm non mộc mạc khơi dậy tình yêu quê hương.',
    content: `Cứ mỗi độ thu về, khi những ngọn gió heo may se lạnh chớm gõ cửa từng nếp nhà, Hà Nội lại khoác lên mình tấm áo sương mờ mộc mạc mà vô cùng lãng mạn. Giữa những thanh âm ồn ã của phố thị, ta chợt nhận ra thu sang nhờ một mùi hương vô cùng đặc trưng: hương cốm mới.

Hương cốm là sự chắt chiu của đất trời, là vị dẻo thơm của hạt lúa nếp non đi qua những ngày nắng hạ, quyện hòa trong cái mát lành của lá sen già làm vỏ bọc. Nhúm một nhúm cốm nhỏ, đưa vào miệng thong thả nhai, vị ngọt bùi thanh tao lan tỏa nơi đầu lưỡi. Nó không chỉ là món ăn chơi, mà là cả một bầu trời ký ức của những người con xa xứ, là tiếng vọng của hồn quê trong lòng phố cổ trầm mặc.`,
    comprehensionQuestion: 'Tác giả nhận biết mùa thu Hà Nội về qua những dấu hiệu thiên nhiên và hương vị đặc trưng nào?',
    reflectionQuestion: 'Viết một đoạn văn ngắn (3 - 5 câu) chia sẻ cảm nhận của em về một hương vị mộc mạc quê hương mà em yêu thích nhất.',
    favorite: true
  },
  {
    id: 'R002',
    title: 'Sức mạnh của lời cảm ơn',
    genre: 'Bài đọc kỹ năng sống',
    topic: 'Kỹ năng sống',
    shortDesc: 'Bài đọc phân tích giá trị tinh thần to lớn của hai chữ "Cảm ơn", giúp xây dựng mối quan hệ tốt đẹp trong môi trường học đường.',
    content: `Trong cuộc sống hằng ngày, hai từ "Cảm ơn" tưởng chừng đơn giản nhưng lại sở hữu một sức mạnh diệu kỳ. Khi nhận được một sự giúp đỡ dù là nhỏ nhặt nhất, một lời cảm ơn chân thành từ đáy lòng sẽ ngay lập tức xóa nhòa khoảng cách, tạo nên sự ấm áp giữa người với người.

Lời cảm ơn không chỉ là biểu hiện của sự lịch thiệp, giáo dục tử tế mà còn là nhịp cầu kết nối lòng biết ơn. Tại trường học, biết nói lời cảm ơn thầy cô, bạn bè, cô chú lao công... giúp chúng ta rèn luyện nhân cách, biết trân trọng sức lao động và sự quan tâm của người khác dành cho mình. Đừng ngần ngại trao đi lời cảm ơn, bởi vì đó là liều thuốc tinh thần làm đẹp thêm cho tâm hồn mỗi con người.`,
    comprehensionQuestion: 'Theo văn bản, việc nói lời cảm ơn trong môi trường học đường mang lại những lợi ích gì cho bản thân học sinh?',
    reflectionQuestion: 'Hãy kể lại một kỷ niệm ngắn khi em nhận được lời cảm ơn từ ai đó và cảm xúc của em lúc ấy thế nào?'
  },
  {
    id: 'R003',
    title: 'Tre Việt Nam - Biểu tượng kiên cường',
    genre: 'Tùy bút',
    topic: 'Văn hóa lịch sử',
    shortDesc: 'Suy ngẫm sâu sắc về hình ảnh cây tre xanh mộc mạc, từ lâu đã trở thành biểu tượng cho cốt cách, ý chí kiên cường của con người Việt Nam.',
    content: `Cây tre từ bao đời nay đã gắn bó máu thịt với làng quê Việt Nam. Bóng tre mát rượi bao phủ lấy cổng làng, rặng tre che chở cho những mái tranh nghèo qua bao mùa mưa nắng bão giông. Tre không kén chọn đất đai, dù là sỏi đá cằn cỗi hay bờ ao bùn lầy, tre vẫn bám rễ sâu vào lòng đất để vươn lên xanh tốt.

Thân tre gầy guộc nhưng dẻo dai phi thường. Gió bão dập dồn, tre ngả nghiêng ôm lấy nhau tạo thành lũy thành trì vững chắc, quyết không chịu gãy rạp. Tính cách ấy của tre phải chăng cũng chính là hình ảnh ẩn dụ cho tinh thần đoàn kết, ý chí bất khuất và tấm lòng thủy chung son sắt của con người Việt Nam qua hàng ngàn năm dựng nước và giữ nước?`,
    comprehensionQuestion: 'Cây tre có những đặc điểm tự nhiên nào tương đồng với phẩm chất của con người Việt Nam?',
    reflectionQuestion: 'Em học được bài học cuộc sống gì từ tinh thần "đoàn kết, bám rễ vững chãi" của lũy tre xanh?'
  }
];

// 4. ĐỀ QUIZ TỰ HỌC (Quizzes)
export const initialQuizzes: Quiz[] = [
  {
    id: 'Q001',
    title: 'Ứng dụng AI trong giáo dục',
    topic: 'Kiến thức chung về AI',
    grade: 'Lớp 6',
    duration: '15 phút',
    questionsCount: 3,
    type: 'Trắc nghiệm',
    questions: [
      {
        id: 'QQ001',
        question: 'Thuật ngữ "AI" viết tắt của cụm từ tiếng Anh nào sau đây?',
        options: [
          'Automatic Integration (Tích hợp tự động)',
          'Artificial Intelligence (Trí tuệ nhân tạo)',
          'Advanced Internet (Mạng Internet tiên tiến)',
          'Application Interface (Giao diện ứng dụng)'
        ],
        correctOptionIndex: 1,
        explanation: 'AI là viết tắt của Artificial Intelligence, dịch sang tiếng Việt nghĩa là Trí tuệ nhân tạo.'
      },
      {
        id: 'QQ002',
        question: 'Hành vi nào sau đây được khuyến khích khi học sinh sử dụng công cụ AI hỗ trợ học tập?',
        options: [
          'Copy hoàn toàn bài làm của AI và nộp cho thầy cô giáo mà không chỉnh sửa.',
          'Sử dụng AI như một người trợ lý gợi ý ý tưởng, sau đó tự mình phân tích và hoàn thiện bài làm.',
          'Dùng AI để làm hộ tất cả các bài tập về nhà để đi chơi game.',
          'Không bao giờ kiểm tra lại thông tin do AI cung cấp vì AI luôn đúng.'
        ],
        correctOptionIndex: 1,
        explanation: 'AI chỉ nên đóng vai trò hỗ trợ, gợi ý ý tưởng. Học sinh cần rèn tư duy phản biện, tự kiểm chứng thông tin và tự viết bài.'
      },
      {
        id: 'QQ003',
        question: 'Đâu KHÔNG phải là một ứng dụng tiêu biểu của AI trong dạy học?',
        options: [
          'Tự động soạn bài giảng slide từ dàn ý.',
          'Chấm điểm và phân tích lỗi sai trong bài viết tiếng Anh.',
          'Thay thế hoàn toàn vai trò truyền cảm hứng và giáo dục đạo đức của giáo viên.',
          'Đề xuất lộ trình học tập cá nhân hóa cho từng học sinh.'
        ],
        correctOptionIndex: 2,
        explanation: 'AI không thể thay thế vai trò truyền cảm hứng, thấu hiểu tâm lý và giáo dục đạo đức của giáo viên thực tế.'
      }
    ]
  },
  {
    id: 'Q002',
    title: 'Kiểm tra kiến thức về tạo video AI',
    topic: 'Kỹ năng làm video ngắn',
    grade: 'Lớp 6',
    duration: '10 phút',
    questionsCount: 2,
    type: 'Trắc nghiệm',
    questions: [
      {
        id: 'QQ004',
        question: 'Thời lượng tối ưu cho một video bài giảng ngắn dạng Micro-learning để thu hút học sinh là bao nhiêu?',
        options: [
          'Khoảng 24 giây đến dưới 2 phút',
          'Tối thiểu 30 phút đến 1 tiếng',
          'Nửa ngày học',
          'Càng dài càng tốt'
        ],
        correctOptionIndex: 0,
        explanation: 'Các video ngắn (micro-learning) tầm 24 giây đến dưới 2 phút giúp giữ sự tập trung cao nhất và dễ dàng truyền tải một khái niệm cốt lõi.'
      },
      {
        id: 'QQ005',
        question: 'Bước đầu tiên và quan trọng nhất trong quy trình sản xuất video AI là gì?',
        options: [
          'Chọn ảnh nền thật sặc sỡ.',
          'Mua mic thu âm đắt tiền nhất.',
          'Thiết lập kịch bản nội dung chuẩn xác.',
          'Đăng video lên TikTok lấy view.'
        ],
        correctOptionIndex: 2,
        explanation: 'Kịch bản nội dung chính là linh hồn của video. AI chỉ giúp chuyển đổi kịch bản đó thành giọng nói và hình ảnh, kịch bản tệ thì video không thể hay.'
      }
    ]
  },
  {
    id: 'Q003',
    title: 'Tạo game học tập bằng Gemini',
    topic: 'Thiết kế game hóa giáo dục',
    grade: 'Lớp 7',
    duration: '15 phút',
    questionsCount: 1,
    type: 'Trắc nghiệm',
    questions: [
      {
        id: 'QQ006',
        question: 'Để yêu cầu Gemini thiết kế một bộ câu hỏi trắc nghiệm về lịch sử Lớp 6 xuất ra dạng bảng dữ liệu, bạn nên dùng kỹ thuật viết prompt nào?',
        options: [
          'Chỉ ghi "tạo game lịch sử cho tôi"',
          'Ghi rõ vai trò (Chuyên gia giáo dục), nhiệm vụ cụ thể (tạo 5 câu trắc nghiệm sử lớp 6), định dạng đầu ra mong muốn (dạng bảng gồm các cột: Câu hỏi, Lựa chọn, Đáp án).',
          'Nhập một đoạn văn tiếng Anh cực dài không rõ nghĩa.',
          'Nhờ người khác viết hộ.'
        ],
        correctOptionIndex: 1,
        explanation: 'Viết prompt có cấu trúc rõ ràng (Vai trò, Nhiệm vụ, Định dạng đầu ra) sẽ giúp các mô hình ngôn ngữ lớn như Gemini phản hồi chính xác nhất.'
      }
    ]
  }
];

// 5. GIAO BÀI TẬP (Assignments)
export const initialAssignments: Assignment[] = [
  {
    id: 'A001',
    title: 'Tạo một video AI 24 giây giới thiệu bài học',
    description: 'Yêu cầu học sinh sử dụng công cụ AI (như gợi ý trong bài học) để viết kịch bản, tạo avatar nói và dựng một video giới thiệu bài mới thời lượng đúng 24 giây. Nộp đường link video lên hệ thống.',
    dueDate: '2026-07-15',
    status: 'Đã chấm',
    coefficient: 1,
    target: 'Cá nhân',
    submittedCount: 38,
    averageGrade: 8.5,
    studentSubmission: 'Em gửi bài làm: Đường link Canva/CapCut chứa video AI 24 giây giới thiệu bài "Đa dạng sinh học". Video có MC AI nói tiếng Việt rõ ràng, kèm phụ đề tiếng Việt rất sinh động ạ!',
    teacherFeedback: 'Bài làm rất tốt, giọng nói MC trôi chảy, hình ảnh minh họa khớp với nội dung. Chúc mừng em đạt điểm cao!',
    gradeValue: 9.5
  },
  {
    id: 'A002',
    title: 'Thiết kế game học tập theo chủ đề môn học',
    description: 'Học sinh làm việc theo nhóm (3-4 bạn). Lựa chọn một chủ đề môn Văn, Toán hoặc Anh lớp 6, dùng AI hỗ trợ soạn câu hỏi và thiết kế một trò chơi nhỏ dạng câu đố (Quizlet, Wordwall hoặc Kahoot).',
    dueDate: '2026-07-20',
    status: 'Đã nộp',
    coefficient: 2,
    target: 'Nhóm',
    submittedCount: 12,
    averageGrade: 7.8,
    studentSubmission: 'Nhóm 3 xin nộp bài: Báo cáo Word thiết kế game "Vượt chướng ngại vật môn Toán số học Lớp 6" kèm link trò chơi Wordwall nhóm đã đóng gói hoàn chỉnh bằng sự hỗ trợ của AI thiết kế câu hỏi.',
    teacherFeedback: 'Game chơi rất vui, tuy nhiên một số câu hỏi hơi khó so với trình bày. Thầy đánh giá cao tinh thần đồng đội.',
    gradeValue: 8.5
  },
  {
    id: 'A003',
    title: 'Viết cảm nhận sau khi học bài bằng sơ đồ tư duy',
    description: 'Vẽ sơ đồ tư duy tóm tắt bài học "Lợi ích của AI" bằng ứng dụng sơ đồ tư duy (hoặc vẽ tay chụp ảnh). Thêm một đoạn văn ngắn khoảng 100 chữ nêu suy nghĩ chân thành của em về tương lai công nghệ.',
    dueDate: '2026-07-25',
    status: 'Chưa nộp',
    coefficient: 1,
    target: 'Cá nhân',
    submittedCount: 0
  },
  {
    id: 'A004',
    title: 'Ghi âm thuyết trình ngắn về sản phẩm học tập',
    description: 'Sử dụng điện thoại hoặc máy tính ghi âm một bài thuyết trình khoảng 2 phút giải thích ý nghĩa sản phẩm sáng tạo của em. Nộp file mp3 hoặc link drive.',
    dueDate: '2026-07-30',
    status: 'Chưa nộp',
    coefficient: 1,
    target: 'Cá nhân',
    submittedCount: 0
  }
];

// 6. ĐỀ KIỂM TRA (Exams)
export const initialExams: Exam[] = [
  {
    id: 'E001',
    title: 'Đề kiểm tra giữa học kỳ I - Môn Năng lực số',
    grade: 'Lớp 6',
    duration: '45 phút',
    totalScore: 10,
    structure: '70% Trắc nghiệm (14 câu), 30% Tự luận (2 câu)',
    createdAt: '2026-07-01',
    part1Mcqs: [
      { question: 'Thiết bị nào sau đây tích hợp trí tuệ nhân tạo rõ nét nhất?', options: ['Bóng đèn dây tóc cổ điển', 'Robot hút bụi thông minh tự vẽ bản đồ nhà', 'Ấm đun nước siêu tốc cơ', 'Quạt trần thông thường'], answer: 'Robot hút bụi thông minh tự vẽ bản đồ nhà' },
      { question: 'Khi sử dụng các chatbot AI, chúng ta nên giao tiếp như thế nào để nhận câu trả lời tốt nhất?', options: ['Ra lệnh cộc lốc một từ', 'Cung cấp prompt chi tiết gồm bối cảnh, vai trò, yêu cầu và ví dụ', 'Không dùng tiếng Việt', 'Mắng mỏ chatbot'], answer: 'Cung cấp prompt chi tiết gồm bối cảnh, vai trò, yêu cầu và ví dụ' },
      { question: 'Mục đích cốt lõi của việc học tập kết hợp công nghệ AI là gì?', options: ['Độ bài tập cho nhanh để đi chơi', 'Phát triển năng lực tự học, tư duy phản biện và giải quyết vấn đề sáng tạo', 'Hạn chế giao tiếp với mọi người xung quanh', 'Thay thế việc đọc sách giấy'], answer: 'Phát triển năng lực tự học, tư duy phản biện và giải quyết vấn đề sáng tạo' }
    ],
    part2Essay: 'Em hãy viết một đoạn văn ngắn (7-10 câu) trình bày suy nghĩ của mình về những quy tắc đạo đức và an toàn thông tin khi sử dụng trí tuệ nhân tạo (AI) trong môi trường học đường hiện nay.',
    answerGuide: 'Định hướng chấm điểm:\n- Học sinh nêu được khái niệm sử dụng AI có trách nhiệm (2.0 điểm).\n- Nêu ít nhất 2 hành vi tốt (không đạo văn, không spam, tôn trọng bản quyền) (1.0 điểm).\n- Diễn đạt trôi chảy, mạch lạc (1.0 điểm).',
    matrix: 'Nhận biết: 40% | Thông hiểu: 30% | Vận dụng thấp: 20% | Vận dụng cao: 10%'
  },
  {
    id: 'E002',
    title: 'Khảo sát chất lượng đầu năm học mới',
    grade: 'Lớp 7',
    duration: '60 phút',
    totalScore: 10,
    structure: '60% Trắc nghiệm, 40% Tự luận',
    createdAt: '2026-07-03',
    part1Mcqs: [
      { question: 'Công cụ tìm kiếm thông tin phổ biến nhất hiện nay là gì?', options: ['Facebook', 'Google Search', 'Paint', 'Excel'], answer: 'Google Search' }
    ],
    part2Essay: 'Hãy mô tả một phần mềm máy tính hoặc một ứng dụng di động mà em thấy có ích nhất cho việc học tập trực tuyến trong năm học vừa qua.',
    answerGuide: 'Học sinh nêu tên phần mềm, chức năng hỗ trợ nổi bật và lợi ích thực tế thu nhận được.',
    matrix: 'Nhận biết: 50% | Thông hiểu: 30% | Vận dụng: 20%'
  },
  {
    id: 'E003',
    title: 'Đề kiểm tra cuối học kỳ I sáng tạo số',
    grade: 'Lớp 6',
    duration: '90 phút',
    totalScore: 10,
    structure: '50% Lý thuyết trắc nghiệm, 50% Thực hành thiết kế',
    createdAt: '2026-07-05',
    part1Mcqs: [
      { question: 'Yếu tố nào quyết định chất lượng đầu ra của một mô hình tạo ảnh AI?', options: ['Kích thước màn hình máy tính', 'Độ chi tiết và logic của câu lệnh Prompt mô tả ảnh', 'Hãng sản xuất bàn phím', 'Tốc độ nhấp chuột'], answer: 'Độ chi tiết và logic của câu lệnh Prompt mô tả ảnh' }
    ],
    part2Essay: 'Thực hành lập trình khối hoặc kéo thả tạo một ứng dụng tính toán diện tích hình chữ nhật đơn giản với giao diện thân thiện với học sinh lớp tiểu học.',
    answerGuide: 'Chấm điểm dựa trên tính logic của thuật toán và độ thẩm mỹ của giao diện do học sinh phác thảo.',
    matrix: 'Lý thuyết: 50% | Thực hành sáng tạo: 50%'
  }
];

// 7. QUẢN LÝ HỌC SINH (Students)
export const initialStudents: Student[] = [
  {
    id: 'HS001',
    name: 'Nguyễn Hoàng Minh',
    grade: 'Lớp 6',
    progress: 88,
    gpa: 8.7,
    badges: ['Chăm chỉ', 'Nỗ lực', 'Tiên phong'],
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'HS002',
    name: 'Trần Mai Anh',
    grade: 'Lớp 6',
    progress: 95,
    gpa: 9.2,
    badges: ['Sáng tạo', 'Xuất sắc', 'Gương mẫu'],
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'HS003',
    name: 'Lê Gia Bảo',
    grade: 'Lớp 7',
    progress: 76,
    gpa: 8.0,
    badges: ['Đồng đội', 'Vượt khó'],
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'HS004',
    name: 'Phạm Khánh Linh',
    grade: 'Lớp 8',
    progress: 91,
    gpa: 9.0,
    badges: ['Tự học', 'Đạt điểm tuyệt đối'],
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  }
];

// 8. NGÂN HÀNG CÂU HỎI (Question Bank)
export const initialQuestionBankItems: QuestionBankItem[] = [
  {
    id: 'QB001',
    subject: 'Tin học',
    grade: 'Lớp 6',
    difficulty: 'Dễ',
    topic: 'Khái niệm AI',
    question: 'Nêu khái niệm cơ bản về Trí tuệ nhân tạo (AI)?',
    suggestedAnswer: 'Trí tuệ nhân tạo (AI) là một ngành của khoa học máy tính liên quan đến việc xây dựng các máy móc thông minh có khả năng thực hiện các nhiệm vụ thường đòi hỏi trí thông minh của con người, chẳng hạn như học hỏi, suy luận, giải quyết vấn đề và hiểu ngôn ngữ tự nhiên.'
  },
  {
    id: 'QB002',
    subject: 'Phương pháp dạy học',
    grade: 'Lớp 10',
    difficulty: 'Trung bình',
    topic: 'Ứng dụng AI',
    question: 'Hãy phân tích 3 lợi ích nổi bật của việc tích hợp AI vào công việc soạn bài giảng của giáo viên?',
    suggestedAnswer: '1. Tiết kiệm thời gian chuẩn bị học liệu (AI hỗ trợ lên dàn ý, viết kịch bản, chuẩn bị hình ảnh nhanh gấp 5 lần).\n2. Tăng sự tương tác sinh động (tạo video bài giảng micro-learning trực quan).\n3. Đa dạng hóa hình thức tiếp cận (dễ dàng dịch bài, điều chỉnh độ khó bài học để cá nhân hóa phù hợp với học sinh kém hoặc giỏi).'
  },
  {
    id: 'QB003',
    subject: 'Trải nghiệm sáng tạo',
    grade: 'Lớp 6',
    difficulty: 'Khó',
    topic: 'Thiết kế hoạt động học tập',
    question: 'Thiết kế một hoạt động học tập kéo dài 45 phút có tích hợp sử dụng công cụ AI cho học sinh thảo luận nhóm về chủ đề bảo vệ môi trường?',
    suggestedAnswer: 'Giáo án gồm 3 phần:\n- 10 phút đầu: Học sinh xem video ngắn do AI tạo về thảm họa rác thải.\n- 20 phút giữa: Các nhóm dùng chatbot AI tìm ý tưởng, giải pháp và vẽ sơ đồ tư duy giải quyết vấn đề.\n- 15 phút cuối: Trình bày và phản biện chéo giữa các nhóm.'
  },
  {
    id: 'QB004',
    subject: 'Kỹ năng số',
    grade: 'Lớp 6',
    difficulty: 'Trung bình',
    topic: 'Viết Prompt AI',
    question: 'Hãy viết một prompt hoàn chỉnh gửi tới AI để sinh kịch bản cho một video bài giảng 24 giây giới thiệu cách phân biệt rác hữu cơ và vô cơ?',
    suggestedAnswer: 'Prompt mẫu: "Hãy đóng vai một giáo viên Sinh học vui tính. Viết cho tôi một kịch bản video ngắn thời lượng đúng 24 giây, phong cách lôi cuốn để học sinh lớp 6 phân biệt rác hữu cơ và rác vô cơ. Kịch bản chia làm 3 cảnh rõ ràng, có lời thoại dí dỏm, ngôn ngữ tiếng Việt dễ thương, tập trung vào điểm mấu chốt nhất để dễ nhớ."'
  }
];

// 9. SẢN PHẨM SÁNG TẠO (Creative Products)
export const initialCreativeProducts: CreativeProduct[] = [
  {
    id: 'P001',
    title: 'Podcast: Hành trình học AI của em',
    type: 'Podcast',
    author: 'Nguyễn Hoàng Minh - Lớp 6',
    description: 'Bản tin audio ngắn tự sự về những bỡ ngỡ ban đầu khi làm quen với máy tính và niềm vui khi tự tay viết những câu lệnh prompt đầu tiên ra lệnh cho AI vẽ tranh phong cảnh quê hương.',
    likes: 42,
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'P002',
    title: 'Video: Giới thiệu bài học bằng AI',
    type: 'Video',
    author: 'Trần Mai Anh - Lớp 6',
    description: 'Một video bài giảng ngắn siêu lôi cuốn ứng dụng kỹ thuật MC ảo giới thiệu bài học "Sự kỳ diệu của hệ mặt trời", thời lượng chuẩn 24 giây với đồ họa vũ trụ tuyệt đẹp.',
    likes: 89,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'P003',
    title: 'Game: Câu cá chữ ôn tập môn Tiếng Việt',
    type: 'Game',
    author: 'Nhóm Sáng Tạo Số - Lớp 7',
    description: 'Trò chơi tương tác câu cá, mỗi khi câu được một chú cá, người chơi phải trả lời nhanh một câu hỏi về thành ngữ tiếng Việt để ghi điểm. Thiết kế sinh động, rực rỡ.',
    likes: 56,
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'P004',
    title: 'Web app: Công cụ tự động tạo câu hỏi trắc nghiệm',
    type: 'Web app',
    author: 'Lê Gia Bảo - Lớp 8',
    description: 'Trang web đơn giản cho phép giáo viên dán văn bản bài học vào, sau đó hiển thị 3 câu hỏi trắc nghiệm tự động gợi ý tức thì, giúp ôn tập cực kỳ tiện lợi.',
    likes: 73,
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'P005',
    title: 'Poster: 5 Quy tắc vàng sử dụng AI an toàn học đường',
    type: 'Poster',
    author: 'Hội đồng Học sinh - Lớp 9',
    description: 'Bản thiết kế infographic trực quan sinh động hướng dẫn các bạn học sinh cách trích dẫn nguồn khi dùng AI, bảo vệ thông tin cá nhân và quản lý thời gian trực tuyến.',
    likes: 38,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&q=80'
  }
];

// 10. QUẢN LÝ TÀI KHOẢN (Accounts)
export const initialAccounts: Account[] = [
  {
    id: 'ACC_ADMIN',
    username: 'ThanhtinAI',
    password: 'AI2026$$$',
    name: 'Dương Thành Tín',
    fullName: 'Dương Thành Tín',
    role: 'teacher',
    status: 'active',
    className: '',
    permissions: 'all',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  },
  {
    id: 'ACC_STUDENT_1',
    username: 'hoangminh',
    password: '123456',
    name: 'Nguyễn Hoàng Minh',
    fullName: 'Nguyễn Hoàng Minh',
    role: 'student',
    status: 'active',
    className: '6A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    permissions: JSON.stringify({
      home: true,
      curriculum: true,
      resources: true,
      reading: true,
      quiz: true,
      assignments: true,
      exams: true,
      products: true,
      profile: true
    })
  },
  {
    id: 'ACC_STUDENT_2',
    username: 'maianh',
    password: '123456',
    name: 'Trần Mai Anh',
    fullName: 'Trần Mai Anh',
    role: 'student',
    status: 'pending',
    className: '6A',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mai',
    permissions: JSON.stringify({
      home: true,
      curriculum: true,
      resources: true,
      reading: true,
      quiz: true,
      assignments: true,
      exams: true,
      products: true,
      profile: true
    })
  }
];
