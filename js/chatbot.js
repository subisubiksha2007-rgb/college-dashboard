// ===============================
// CSE Dashboard Chatbot
// ===============================

const pageActions = [
  { keywords: ['attendance', 'present', 'absent'], page: 'attendance.html', reply: 'Opening Attendance Page...' },
  { keywords: ['student', 'students', 'class list'], page: 'students.html', reply: 'Opening Students Page...' },
  { keywords: ['faculty', 'teacher', 'staff'], page: 'faculty.html', reply: 'Opening Faculty Page...' },
  { keywords: ['course', 'courses', 'subject', 'subjects'], page: 'courses.html', reply: 'Opening Courses Page...' },
  { keywords: ['placement', 'placements', 'job'], page: 'placements.html', reply: 'Opening Placements Page...' },
  { keywords: ['project', 'projects'], page: 'projects.html', reply: 'Opening Projects Page...' },
  { keywords: ['achievement', 'achievements'], page: 'achievements.html', reply: 'Opening Achievements Page...' },
  { keywords: ['event', 'events'], page: 'events.html', reply: 'Opening Events Page...' },
  { keywords: ['notice', 'notices', 'announcement'], page: 'notices.html', reply: 'Opening Notices Page...' },
  { keywords: ['setting', 'settings'], page: 'settings.html', reply: 'Opening Settings Page...' }
];

const knowledgeBase = [
  {
    keywords: ['dbms', 'database management system'],
    reply: 'DBMS stands for Database Management System. It is software used to store, organize, manage, and retrieve data efficiently. Examples include MySQL, Oracle, and PostgreSQL.'
  },
  {
    keywords: ['hod', 'head of department', 'department head'],
    reply: 'Our HOD is Dr. R. Kumar, Head of the Computer Science & Engineering Department.'
  },
  {
    keywords: ['ai', 'artificial intelligence'],
    reply: 'Artificial Intelligence helps computers learn, reason, and make decisions. It is used in chatbots, recommendation systems, image recognition, and automation.'
  },
  {
    keywords: ['python'],
    reply: 'Python is a beginner-friendly programming language used for web development, data science, automation, AI, and machine learning.'
  },
  {
    keywords: ['cse', 'computer science'],
    reply: 'CSE stands for Computer Science & Engineering. It focuses on programming, databases, networks, AI, software engineering, and computer systems.'
  },
  {
    keywords: ['subiksha'],
    reply: 'Subiksha | Reg No: 240310101006 | III Year | Computer Science & Engineering.'
  },
  {
    keywords: ['hari'],
    reply: 'Hari Prakash | Reg No: 240310101001 | III Year | Computer Science & Engineering.'
  },
  {
    keywords: ['lokesh'],
    reply: 'Lokeshwaran | Reg No: 240310101002 | III Year | Computer Science & Engineering.'
  },
  {
    keywords: ['lorin'],
    reply: 'Lorin | Reg No: 240310101003 | III Year | Computer Science & Engineering.'
  },
  {
    keywords: ['satish'],
    reply: 'Satish Kumar | Reg No: 240310101005 | III Year | Computer Science & Engineering.'
  },
  {
    keywords: ['meenakshi', 'meena'],
    reply: 'Meenakshi | Reg No: 240310101004 | III Year | Computer Science & Engineering.'
  },
  {
    keywords: ['varalakshmi', 'lachuu'],
    reply: 'Varalakshmi | Reg No: 240310101007 | III Year | Computer Science & Engineering.'
  }
];

function sendMessage() {
  const userInput = document.getElementById('userInput');
  const chatBox = document.getElementById('chatBox');

  if (!userInput || !chatBox) return;

  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(chatBox, message, 'user-message');
  userInput.value = '';

  const response = getBotResponse(message);
  setTimeout(() => {
    appendMessage(chatBox, response.reply, 'bot-message');
    chatBox.scrollTop = chatBox.scrollHeight;

    if (response.page) {
      setTimeout(() => {
        window.location.href = response.page;
      }, 900);
    }
  }, 350);
}

function getBotResponse(message) {
  const normalized = message.toLowerCase();

  if (hasAny(normalized, ['hi', 'hello', 'hey'])) {
    return { reply: 'Hello! Ask me anything about CSE, DBMS, HOD, attendance, students, faculty, placements, projects, events, or notices.' };
  }

  if (hasAny(normalized, ['thank', 'thanks'])) {
    return { reply: "You're welcome!" };
  }

  if (hasAny(normalized, ['bye', 'goodbye'])) {
    return { reply: 'Goodbye. Have a great day!' };
  }

  const pageAction = pageActions.find(action => hasAny(normalized, action.keywords) && hasAny(normalized, ['show', 'open', 'go', 'view', 'display']));
  if (pageAction) {
    return { reply: pageAction.reply, page: pageAction.page };
  }

  const directPageAction = pageActions.find(action => normalized === action.keywords[0] || normalized === action.page.replace('.html', ''));
  if (directPageAction) {
    return { reply: directPageAction.reply, page: directPageAction.page };
  }

  const answer = knowledgeBase.find(item => hasAny(normalized, item.keywords));
  if (answer) {
    return { reply: answer.reply };
  }

  return {
    reply:
      "Sorry, I couldn't understand that.<br><br>" +
      'Try asking:<br>' +
      '- What is DBMS?<br>' +
      '- Who is HOD?<br>' +
      '- Show Attendance<br>' +
      '- Show Students<br>' +
      '- Show Faculty<br>' +
      '- Show Placements<br>' +
      '- Show Events'
  };
}

function hasAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function appendMessage(chatBox, message, className) {
  const div = document.createElement('div');
  div.className = className;
  div.innerHTML = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('userInput');
  if (!input) return;

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });
});

window.sendMessage = sendMessage;
