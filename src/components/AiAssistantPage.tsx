/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Bot, Sparkles, User, HelpCircle, FileText, BookOpen, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

interface AiAssistantPageProps {
  role?: 'TEACHER' | 'STUDENT';
}

export default function AiAssistantPage({ role = 'TEACHER' }: AiAssistantPageProps) {
  const isTeacher = role === 'TEACHER';

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: isTeacher
        ? 'Xin chào thầy/cô! Tôi là trợ lý giáo dục Thành Tín AI. Tôi có thể hỗ trợ thầy/cô thiết kế bài giảng, soạn kịch bản video ngắn 24s, xây dựng câu hỏi kiểm tra, hoặc gợi ý các ý tưởng trò chơi lớp học thú vị. Hãy chọn một mẫu gợi ý bên dưới hoặc viết câu hỏi của thầy/cô nhé!'
        : 'Chào em! Anh là trợ lý học tập Thành Tín AI. Anh có thể giúp em giải thích các tác phẩm Ngữ văn khó hiểu, gợi ý dàn ý bài tập làm văn, ôn luyện kiến thức trắc nghiệm hoặc hướng dẫn cách làm bài tập tự học. Hãy chọn một gợi ý bên dưới hoặc hỏi anh nhé!',
      time: 'Vừa xong'
    }
  ]);
  const [input, setInput] = useState('');

  const teacherTemplates = [
    { label: 'Tạo kịch bản video 24s', text: 'Hãy viết kịch bản video 24s giới thiệu bài học môn Ngữ Văn về chủ đề Lòng yêu nước.' },
    { label: 'Thiết kế game câu hỏi', text: 'Gợi ý ý tưởng trò chơi "Câu cá học tập" để ôn tập kiến thức Lớp 6.' },
    { label: 'Soạn prompt AI mẫu', text: 'Tạo một prompt AI mẫu giúp học sinh tự đóng vai nhà văn phân tích nhân vật văn học.' },
    { label: 'Tóm tắt bài giảng nhanh', text: 'Viết tóm tắt súc tích bài giảng "Ứng dụng AI xây dựng web app giáo dục" dài 100 chữ.' }
  ];

  const studentTemplates = [
    { label: 'Gợi ý phân tích Dế Mèn', text: 'Hãy gợi ý dàn ý chi tiết phân tích nhân vật Dế Mèn trong đoạn trích Bài học đường đời đầu tiên.' },
    { label: 'Giải thích Biện pháp tu từ', text: 'Hãy giải thích biện pháp tu từ nhân hóa và so sánh bằng ví dụ thơ dễ thương, dễ hiểu cho học sinh lớp 6.' },
    { label: 'Dàn ý bài văn kể chuyện', text: 'Lập dàn ý cho bài văn kể lại một trải nghiệm đáng nhớ của em với người thân.' },
    { label: 'Bí quyết đọc hiểu văn bản', text: 'Hãy chia sẻ 3 bước giúp em đọc hiểu một bài thơ hoặc văn bản thông tin nhanh nhất.' }
  ];

  const templates = isTeacher ? teacherTemplates : studentTemplates;

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response based on keywords
    setTimeout(() => {
      let replyText = isTeacher 
        ? 'Tôi đã nhận được yêu cầu của thầy/cô. Đây là gợi ý từ Thành Tín AI để triển khai ngay:\n\n'
        : 'Anh đã nhận được câu hỏi học tập của em. Dưới đây là hướng dẫn học tập chi tiết dành cho em:\n\n';
      
      const lowerText = textToSend.toLowerCase();
      if (isTeacher) {
        if (lowerText.includes('24s') || lowerText.includes('kịch bản')) {
          replyText += `**KỊCH BẢN VIDEO GIỚI THIỆU BÀI HỌC (THỜI LƯỢNG 24 GIÂY)**\n\n` +
            `*   **[0-5s] Mở đầu:** Hình ảnh hệ mặt trời chuyển động. MC ảo chào mừng: "Chào mừng các bạn đến với hành trình khám phá Sự kỳ diệu của hệ mặt trời!"\n` +
            `*   **[5-15s] Cao trào:** Lướt qua Trái đất, Sao hỏa. Câu hỏi gợi mở: "Bạn có biết tại sao Sao hỏa lại có màu đỏ rực rỡ và hành tinh nào nóng nhất không?"\n` +
            `*   **[15-20s] Giải pháp:** "Bấm ngay vào học liệu số để cùng giải mã bí ẩn vũ trụ và tham gia thử thách câu cá chữ đầy kịch tính!"\n` +
            `*   **[20-24s] Kêu gọi hành động:** Hiển thị nút "Bắt đầu bài học". "Hãy cùng Thành Tín LMS sẵn sàng xuất phát!"`;
        } else if (lowerText.includes('game') || lowerText.includes('trò chơi')) {
          replyText += `**Ý TƯỞNG THIẾT KẾ TRÒ CHƠI "CÂU CÁ CHỮ" HOẠT ĐỘNG NHÓM**\n\n` +
            `1.  **Chuẩn bị:** Sử dụng AI tạo ra 10 hình ảnh chú cá nhiều màu sắc, mỗi chú cá mang một từ khóa hoặc câu hỏi ôn tập ngữ pháp Lớp 6.\n` +
            `2.  **Luật chơi:** Lớp chia thành 4 đội. Đại diện đội bấm chọn chú cá bơi trên màn hình thông minh. Khi chú cá được "câu", câu hỏi trắc nghiệm hiện ra.\n` +
            `3.  **Tính điểm:** Trả lời đúng nhận 10 điểm và chú cá thuộc về đội. Trả lời sai, cơ hội giành quyền trả lời thuộc về đội khác.\n` +
            `4.  **Tác động:** Giúp nâng cao tinh thần học tập tập thể, tăng tương tác số cực kỳ phấn khích!`;
        } else if (lowerText.includes('prompt') || lowerText.includes('câu hỏi')) {
          replyText += `**PROMPT AI MẪU CHO HỌC SINH TỰ HỌC SÁNG TẠO**\n\n` +
            `\`\`\`text\n` +
            `Bạn là một nhà phê bình văn học lỗi lạc. Hãy đóng vai nhân vật Dế Mèn trong "Dế Mèn Phiêu Lưu Ký" và trò chuyện cùng tôi. Trả lời các câu hỏi của tôi với giọng điệu kiêu hãnh nhưng đã biết ăn năn hối lỗi sau bài học đầu tiên. Hãy bắt đầu bằng cách giới thiệu bản thân mình.\n` +
            `\`\`\`\n\n` +
            `*Hướng dẫn của giáo viên:* Học sinh sao chép prompt này dán vào Trợ lý AI học tập để thực hành đọc hiểu và cảm nhận tác phẩm một cách trực quan, sinh động.`;
        } else {
          replyText += `Cảm ơn thầy/cô đã liên hệ! Tôi đã lưu yêu cầu: "${textToSend}" để tối ưu hóa thuật toán trợ lý giảng dạy.\n\n` +
            `**Đề xuất hành động tiếp theo:**\n` +
            `- Thầy/cô có thể tạo trực tiếp **Phiếu học tập** hoặc **Đề quiz trắc nghiệm** trong tab tương ứng.\n` +
            `- Sử dụng công cụ xuất bản sang PowerPoint hoặc in PDF để gửi trực tiếp cho các lớp học số.`;
        }
      } else {
        // Student response
        if (lowerText.includes('dế mèn') || lowerText.includes('phân tích')) {
          replyText += `**DÀN Ý PHÂN TÍCH NHÂN VẬT DẾ MÈN (BÀI HỌC ĐƯỜNG ĐỜI ĐẦU TIÊN)**\n\n` +
            `*   **1. Mở bài:** Giới thiệu tác giả Tô Hoài, tác phẩm "Dế Mèn phiêu lưu ký" và nhân vật chính Dế Mèn kiêu căng nhưng sau đó đã thức tỉnh.\n` +
            `*   **2. Thân bài:**\n` +
            `    *   *Vẻ đẹp ngoại hình cường tráng:* Càng mẫm bóng, vuốt cứng, cánh dài dật dờ dấn, râu dài uốn cong rất dũng mãnh.\n` +
            `    *   *Tính nết kiêu ngạo, hống hách:* Hay khinh khỉnh, ghẹo chị Cốc dẫn đến cái chết oan uổng, thương tâm của Dế Choắt.\n` +
            `    *   *Sự thức tỉnh sau biến cố:* Dế Mèn ăn năn hối hận vô cùng, chôn cất Dế Choắt và rút ra bài học đường đời đầu tiên về lòng bao dung.\n` +
            `*   **3. Kết bài:** Nêu cảm nhận sâu sắc của em về bài học cuộc sống sâu sắc từ tác phẩm Ngữ Văn lớp 6 này.`;
        } else if (lowerText.includes('tu từ') || lowerText.includes('biện pháp')) {
          replyText += `**GIẢI THÍCH BIỆN PHÁP TU TỪ NHÂN HÓA VÀ SO SÁNH**\n\n` +
            `1.  **Biện pháp Nhân hóa:** Là gọi hoặc tả con vật, cây cối bằng những từ ngữ vốn dùng cho con người.\n` +
            `    *   *Ví dụ:* "Ông trời mặc áo giáp đen ra trận" -> Ông trời được ví như một vị tướng anh hùng chuẩn bị chiến đấu.\n` +
            `2.  **Biện pháp So sánh:** Là đối chiếu hai sự vật có nét tương đồng để tăng sức gợi hình, gợi cảm.\n` +
            `    *   *Ví dụ:* "Trẻ em như búp trên cành" -> So sánh em bé non nớt, dễ thương với búp lá xanh non ngọt ngào.\n` +
            `3.  **Tác dụng chung:** Làm cho câu thơ, câu văn thêm phần sinh động, lôi cuốn và tràn đầy cảm xúc hơn!`;
        } else if (lowerText.includes('dàn ý') || lowerText.includes('văn')) {
          replyText += `**DÀN Ý CHI TIẾT KỂ VỀ MỘT TRẢI NGHIỆM ĐÁNG NHỚ**\n\n` +
            `*   **Mở bài:** Giới thiệu ngắn gọn về trải nghiệm đó (chuyến đi biển cùng gia đình, hoặc ngày đầu tiên bước vào mái trường cấp hai).\n` +
            `*   **Thân bài:**\n` +
            `    *   Thời gian, địa điểm xảy ra sự việc.\n` +
            `    *   Diễn biến của câu chuyện: Chuyện gì đã xảy ra? Mọi người xung quanh đã phản ứng thế mang cảm xúc gì?\n` +
            `    *   Điều gì làm em nhớ nhất và vì sao?\n` +
            `*   **Kết bài:** Ý nghĩa của trải nghiệm đối với sự trưởng thành của em (giúp em hiểu ra tình thương gia đình, hay trân quý bạn bè).`;
        } else {
          replyText += `Chào em! Anh rất vui được đồng hành cùng em học tập tốt hơn. Anh đã nhận được câu hỏi: "${textToSend}".\n\n` +
            `**Lời khuyên học tập từ Thành Tín AI:**\n` +
            `- Em hãy mở ngay mục **Chương trình học** hoặc **Kho học liệu** để đọc thêm tài liệu bổ ích nhé.\n` +
            `- Nếu có bài tập chưa nộp, hãy bấm vào tab **"Bài tập của em"** để hoàn thành đúng hạn nhé.`;
        }
      }

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  return (
    <div id="ai-assistant-page" className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 font-display flex items-center gap-2">
          <Bot className="w-7 h-7 text-[#2F7668]" /> {isTeacher ? 'Trợ Lý Giáo Viên AI' : 'Trợ Lý Học Tập AI'}
        </h2>
        <p className="text-xs text-gray-500">
          {isTeacher 
            ? 'Công cụ hỗ trợ giáo án tự động, tạo kịch bản, prompt sáng tạo và tư vấn sư phạm 24/7.'
            : 'Đồng hành thông minh hỗ trợ giải thích bài học, hướng dẫn làm văn và giải đáp thắc mắc học tập 24/7.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
         {/* Left pane: Templates */}
        <div className="lg:col-span-4 bg-white p-5 rounded-[24px] border border-cream-dark/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Mẫu Gợi Ý Sẵn Có
            </h3>
            <p className="text-xs text-gray-400">
              {isTeacher
                ? 'Nhấp vào một mẫu bên dưới để gửi nhanh câu lệnh cho trợ lý AI thiết lập giáo án:'
                : 'Bấm chọn một trong những câu hỏi mẫu dưới đây để được Trợ lý AI hướng dẫn nhanh:'}
            </p>
            <div className="space-y-2 pt-2">
              {templates.map((tpl, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(tpl.text)}
                  className="w-full text-left p-3 rounded-xl bg-cream-light hover:bg-[#2F7668]/10 border border-cream-dark/40 text-xs font-semibold text-gray-700 hover:text-primary transition-colors flex items-start gap-2.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{tpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#F7F3EC]/50 border border-dashed border-[#E5E1D8] rounded-2xl text-[11px] text-gray-500 leading-relaxed">
            <span className="font-bold text-[#2D2D2D] block mb-1">
              {isTeacher ? 'Mẹo nhỏ sư phạm:' : 'Lời khuyên học tốt:'}
            </span>
            {isTeacher 
              ? 'Kết hợp prompt AI trực tiếp vào phần "Nhiệm vụ học tập" của học sinh để tạo ra các đề bài mở, khuyến khích học sinh đóng vai, phỏng vấn và phản biện.'
              : 'Hãy tập tự lập dàn ý trước khi nhờ AI góp ý nhé. Điều này sẽ giúp khả năng tư duy văn học của em phát triển vượt trội!'}
          </div>
        </div>

        {/* Right pane: Chat box */}
        <div className="lg:col-span-8 bg-white rounded-[24px] border border-cream-dark/40 shadow-sm overflow-hidden flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="p-4 bg-[#F7F3EC]/40 border-b border-cream-dark/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center relative">
                <Bot className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
              </div>
              <div>
                <span className="font-bold text-xs text-gray-800 block">Thành Tín AI</span>
                <span className="text-[10px] text-green-600 font-bold block">
                  {isTeacher ? 'Sẵn sàng hỗ trợ soạn bài' : 'Đồng hành học tập cùng em'}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
              Gemini model
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-cream-light/30">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === 'user' ? 'bg-[#2F7668] text-white' : 'bg-[#E5F0ED] text-primary'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message body */}
                <div className="space-y-1">
                  <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white text-gray-700 border border-cream-dark/30 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[9px] text-gray-400 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-cream-dark/20 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isTeacher ? 'Nhập câu lệnh của thầy/cô tại đây...' : 'Nhập câu hỏi học tập của em tại đây...'}
              className="flex-1 bg-[#F7F3EC]/50 border border-[#E5E1D8]/60 rounded-xl py-2 px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2F7668]/30 focus:bg-white transition-all text-[#2D2D2D]"
            />
            <button
              type="submit"
              className="w-10 h-10 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
