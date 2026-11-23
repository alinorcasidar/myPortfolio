/* ALINOR.AI — a conversational assistant that answers questions about Alinor.
   1) If the site runs on Vercel with ANTHROPIC_API_KEY set, /api/chat (Claude) answers — fully free-form.
   2) Otherwise this built-in engine answers: it remembers the topic, handles follow-ups
      ("you sure?", "tell me more", "why?", "how?"), yes/no to its own offers, small talk,
      typos and two-topic questions. Every fact below comes from Alinor's own portfolio. */
(function () {
  const EMAIL = 'casidar.alinor1017@gmail.com', PHONE = '+63 985 241 5204';
  const RESUME = (window.BASE || '') + 'resume/Alinor%20Casidar%20-%20Resume.pdf';
  const pick = v => Array.isArray(v) ? v[Math.floor(Math.random() * v.length)] : v;

  /* ======================= KNOWLEDGE =======================
     keys: strong keywords (2 pts; multi-word phrases 3 pts) · soft: weak hints (1 pt)
     a: first answer · more: deeper answer · why / how: follow-up answers
     offer: question the bot asks at the end ({ q, to, kind }) · chips: follow-up buttons */
  const T = {
    who: { label: 'who Alinor is',
      keys: ['who is he', 'whos he', 'who is alinor', 'whos alinor', 'who is this guy', 'who is casidar', 'about him', 'about alinor', 'introduce', 'introduction', 'summary', 'background', 'overview', 'alinor casidar', 'tell me about alinor', 'full name', 'his name'], soft: ['alinor', 'casidar', 'him', 'tell me about'],
      a: `**Alinor Malonzo Casidar** is a Computer Engineering graduate from **USTP**, based in **Cagayan de Oro, Philippines**.\n\nHe builds full-stack websites, Flutter mobile apps, IoT/embedded systems and AI computer-vision projects, and he has **6+ years** of hands-on hardware repair experience. He interned as an **IT Intern | Developer at DILG Region X**.`,
      more: `A few highlights:\n• a **Flutter app for DILG Region X** (the Citizen's Charter)\n• a **Raspberry Pi RFID tollgate** synced with Firebase\n• an **AI Braille recognition + voice translator**\n• an **e-commerce system** with real-time ordering\n\nAnd on the hardware side, **6+ years** repairing phones, laptops and PCs.`,
      why: `He grew up around tech — his father was also a technician, which got him into hardware repair. From there he moved into software, IoT and AI, and he especially enjoys building systems where **hardware is controlled through apps and websites**.`,
      offer: { q: 'Want to know which roles he’s aiming for?', to: 'goal' },
      chips: ['What roles is he aiming for?', 'What are his skills?', 'Show me his projects'] },

    edu: { label: 'his education',
      keys: ['education', 'school', 'study', 'studied', 'graduate', 'graduated', 'degree', 'college', 'university', 'ustp', 'course', 'diploma', 'fresh graduate'], soft: ['bs'],
      a: `Alinor graduated with a degree in **Computer Engineering** from **USTP** (University of Science and Technology of Southern Philippines), with a solid grounding in computer architecture, programming logic and systems integration.`,
      more: `That background is why he's comfortable on both sides — writing software *and* wiring hardware. You can see the mix in builds like the **RFID tollgate** (Raspberry Pi + web dashboard + Firebase) and the **web-integrated flood monitor**.`,
      offer: { q: 'Want to see the projects that show this?', to: 'projects' },
      chips: ['Show me his projects', 'Tell me about his internship', 'What are his skills?'] },

    intern: { label: 'his DILG internship',
      keys: ['intern', 'internship', 'ojt', 'dilg', 'on the job', 'dilg region x', 'dilg x'], soft: ['government'],
      a: `Alinor interned as an **IT Intern | Developer at DILG Region X**. There he:\n• handled network troubleshooting and basic configuration\n• did PC/laptop diagnostics, repair and maintenance\n• set up and maintained the LAN, and repaired printers\n• built the **DILG Region X Citizen's Charter** mobile app in **Flutter**\n• strengthened his full-stack web skills`,
      more: `The **Citizen's Charter app** presents the agency's Transparency, Bids Opportunities and Job Offers in a clean accordion layout with **search and filter**, so visitors can find public-service information in one place. He balanced that development work with day-to-day IT support.`,
      how: `He built the Citizen's Charter app with **Flutter**: content is grouped into accordion sections (Transparency, Bids Opportunities, Job Offers, citizen services) with search and filter on top, so it's quick to browse on a phone.`,
      offer: { q: 'Want to hear about the networking side of that work?', to: 'net' },
      chips: ['How did he build the DILG app?', 'Is he into networking?', 'What else has he built?'] },

    exp: { label: 'his experience',
      keys: ['experience', 'work history', 'employment', 'previous work', 'years of experience', 'how long', 'work experience', 'worked', 'jobs'], soft: ['job', 'work'],
      a: `Alinor's experience:\n• **Hardware Repair Technician** — 6+ years\n• **IT Intern | Developer** — DILG Region X\n• **Freelance Embedded & Web Developer** — independent / client-based IoT and full-stack projects`,
      more: `As a freelancer he combines hardware and software — IoT embedded systems plus full-stack web solutions. Before that, years of repair work taught him to diagnose problems fast, down to motherboard level.`,
      offer: { q: 'Want details on his DILG internship?', to: 'intern' },
      chips: ['Tell me about his internship', 'Tell me about his hardware work', 'What are his skills?'] },

    hw: { label: 'his hardware work',
      keys: ['hardware', 'repair', 'technician', 'fix', 'fixing', 'motherboard', 'laptop', 'cellphone', 'mobile repair', 'reformat', 'troubleshooting', 'electronics'], soft: ['phone', 'computer', 'pc', 'device'],
      a: `Alinor has **6+ years** as a hardware technician — inspired by his father, who was also a technician. He repairs computers, laptops and mobile devices: reformatting, hardware diagnostics, **motherboard-level troubleshooting** and complex mobile repairs.`,
      more: `He built those skills through hands-on work, self-study and solving problems on his own. He also enjoys building systems where **hardware is controlled through apps and websites** — which is where his IoT projects come from.`,
      why: `It started at home: his **father was also a technician**, and Alinor picked up the craft from there — then kept growing it through self-study and real repair work.`,
      offer: { q: 'Want to see his IoT projects?', to: 'iot' },
      chips: ['Show me his IoT projects', 'Is he into networking?', 'How can I contact him?'] },

    goal: { label: 'his career goals',
      keys: ['goal', 'goals', 'career', 'aspire', 'aspiring', 'aiming', 'future', 'dream', 'want to be', 'target role', 'which role', 'what role', 'roles', 'path', 'paths', 'plans'], soft: ['role', 'position', 'plan', 'looking for'],
      a: `Alinor is aiming for one of three paths:\n1. **Cyber Security**\n2. **Network Engineering**\n3. **Web Development**\n\nHe's open to opportunities in any of the three.`,
      more: `What he brings to each:\n• **Cyber Security** — network troubleshooting, deep system diagnostics, secure logins in his web apps\n• **Network Engineering** — LAN setup and network configuration at DILG Region X, IoT devices synced to the cloud\n• **Web Development** — full-stack sites, a Flutter app, real-time dashboards he's already shipped`,
      why: `Because of where he's coming from: years of finding out **why systems break** — hardware, networks and software. Security, networking and web development are the natural next steps from that mix.`,
      offer: { q: 'Want to know why he chose these paths?', to: 'goal', kind: 'why' },
      chips: ['Why these three paths?', 'Is he into cyber security?', 'How can I contact him?'] },

    sec: { label: 'cyber security',
      keys: ['cyber', 'cybersecurity', 'security', 'secure', 'hacking', 'hacker', 'pentest', 'penetration', 'soc', 'infosec', 'ethical hacking', 'cyber security'], soft: ['protect', 'threat', 'defend'],
      a: `**Cyber Security** is one of Alinor's target careers. The foundation he brings:\n• network troubleshooting & configuration (DILG Region X)\n• deep system and hardware diagnostics (6+ years)\n• secure logins and user management in his web apps\n• problem-solving under pressure`,
      more: `In his projects, security shows up as **secure login and user management** (the dental clinic app and the financing system's secure back-end). He's eager to grow into the field and build on his networking and systems background.`,
      why: `He's spent years finding out why systems fail. Security is the next step for him: making sure they can't be broken **on purpose**.`,
      offer: { q: 'Want to know why he’s drawn to security?', to: 'sec', kind: 'why' },
      chips: ['Why cyber security?', 'Is he into networking?', 'Is he available for work?'] },

    net: { label: 'networking',
      keys: ['network', 'networking', 'lan', 'router', 'routing', 'switch', 'cisco', 'ip address', 'subnet', 'network engineer', 'network engineering'], soft: ['wifi', 'internet', 'printer', 'connect'],
      a: `**Network Engineering** is another of Alinor's target paths. At DILG Region X he handled **network troubleshooting and basic configuration**, **LAN setup and maintenance**, and printer repair.`,
      more: `His IoT projects show networking in practice too: the **RFID tollgate** syncs with **Firebase Realtime Database**, and the **flood monitor** sends real-time sensor data to a web dashboard.`,
      why: `He likes making systems talk to each other reliably — from office LANs to sensors syncing with the cloud.`,
      offer: { q: 'Want to hear about the tollgate project?', to: 'p-toll' },
      chips: ['Tell me about the tollgate', 'Why networking?', 'Is he into cyber security?'] },

    web: { label: 'web development',
      keys: ['web', 'website', 'websites', 'frontend', 'front end', 'backend', 'back end', 'full stack', 'fullstack', 'php', 'javascript', 'html', 'css', 'tailwind', 'web developer', 'web development'], soft: ['developer', 'develop', 'api', 'database', 'coding', 'code'],
      a: `Web development is Alinor's strongest hands-on area: **HTML / CSS / Tailwind, JavaScript and PHP**, back-end development, **API integration and database management**.\n\nExamples: an e-commerce system for refurbished iPhones/iPads, a dental clinic web app (upcoming), and dashboards for his flood monitor and tollgate.`,
      more: `He's handled responsive front-ends, back-end logic and databases end to end — like **real-time ordering** with a cloud database in the e-commerce system, and the **admin web panel** for the tollgate.`,
      why: `He's already shipped working systems end to end, and he enjoys combining technical function with good visual design.`,
      offer: { q: 'Want to hear about the e-commerce project?', to: 'p-shop' },
      chips: ['Tell me about the e-commerce project', 'Does he build mobile apps?', 'Show me his projects'] },

    mobile: { label: 'mobile apps',
      keys: ['flutter', 'mobile app', 'android', 'ios', 'app development', 'mobile apps'], soft: ['app', 'apps', 'mobile'],
      a: `Alinor builds mobile apps with **Flutter**. His main one is the **DILG X Interactive Information System** — the agency's Citizen's Charter (Transparency, Bids Opportunities, Job Offers) in a clean accordion layout with search and filters, built during his internship.`,
      more: `The goal of that app was simple access: visitors find citizen services, job and bidding opportunities and transparency reports in one place, on their phone.`,
      offer: { q: 'Want to hear more about his internship?', to: 'intern' },
      chips: ['Tell me about his internship', 'What web projects has he built?', 'What are his skills?'] },

    skills: { label: 'his skills',
      keys: ['skills', 'skill', 'tech stack', 'stack', 'technologies', 'tools', 'expertise', 'capable', 'abilities', 'proficient'], soft: ['good at', 'can he', 'know'],
      a: `Alinor's skills:\n• **Web & system:** Flutter, responsive front-end, full-stack back-end, HTML/CSS/Tailwind, JavaScript/PHP, APIs & databases\n• **Hardware & network:** network troubleshooting & config, LAN & printer repair, laptop/desktop diagnostics, embedded systems, IoT sensor automation\n• **AI:** machine learning for computer vision (CNN)`,
      more: `Soft skills: **problem-solving**, **critical thinking**, quick learner, **teamwork**, willing to learn and grow, and **handling pressure**.`,
      offer: { q: 'Want to see projects that use these skills?', to: 'projects' },
      chips: ['Show me his projects', 'What are his soft skills?', 'Is he into cyber security?'] },

    langs: { label: 'programming languages',
      keys: ['programming language', 'programming languages', 'languages', 'language', 'dart', 'python', 'java'], soft: ['program', 'programming'],
      a: `From his portfolio: **JavaScript**, **PHP** and **HTML/CSS** (with Tailwind) for the web, and **Flutter** for mobile apps. He also works with **Firebase**, **Raspberry Pi** and machine-learning (CNN) models.

Need a language that isn't listed? Ask him directly at ${EMAIL}.`,
      chips: ['What are his skills?', 'Show me his projects', 'How can I contact him?'] },

    projects: { label: 'his projects',
      keys: ['projects', 'project', 'portfolio', 'built', 'examples', 'samples', 'what has he built', 'what did he build', 'what has he made', 'what did he make'], soft: ['made', 'create', 'created', 'build', 'builds'],
      a: `Alinor has **20+ completed projects**. Highlights:\n• E-commerce system for refurbished iPhones & iPads\n• Dental Clinic Web App (upcoming)\n• DILG X Interactive Information System (Flutter)\n• Financing Application (private)\n• Smart LPG gas leak detection & auto shutoff\n• Smart Water Irrigation\n• Web-Integrated Flood Monitor\n• Durian ripeness classification (AI)\n• Braille recognition & voice translator (AI)\n• Automatic Tollgate (RFID + cash, Raspberry Pi)`,
      more: `They fall into four groups: **web & app** (e-commerce, dental, DILG app, financing), **IoT / embedded** (LPG, irrigation, flood monitor, tollgate), **AI / ML** (durian, Braille) and **hardware & internship**. Ask about any one by name!`,
      offer: { q: 'Want me to pick a favorite and explain it?', to: 'p-toll' },
      chips: ['Tell me about the tollgate', 'Tell me about the Braille project', 'What AI projects has he made?'] },

    'p-shop': { label: 'the e-commerce project',
      keys: ['ecommerce', 'e commerce', 'iphone', 'ipad', 'shop', 'store', 'refurbished', 'online selling', 'online store'], soft: ['ordering', 'cart'],
      a: `**E-Commerce System for Refurbished iPhones & iPads** — a responsive web shop with real-time product management backed by a cloud database.`,
      more: `Customers browse devices by category, use a **shopping cart**, and pay in **full or by downpayment**; delivery is handled based on location. The cloud database loads products dynamically, manages inventory and stores orders — practical for a small online business.`,
      how: `Products, inventory and orders live in a **cloud database**, so the catalog loads dynamically and orders are stored in real time; the front-end is responsive so it works on phones and desktops.`,
      offer: { q: 'Want to hear about another project?', to: 'projects', kind: 'more' },
      chips: ['How does it work?', 'Tell me about the tollgate', 'Show me all projects'] },

    'p-dental': { label: 'the dental clinic app',
      keys: ['dental', 'dentist', 'clinic', 'appointment', 'appointments'], soft: ['patient'],
      a: `**Dental Clinic Web App** (upcoming) — a full-stack app for managing **appointments and patient records**.`,
      more: `It features a **secure login**, an easy-to-use **appointment dashboard**, and **automated email reminders**.`,
      chips: ['Show me all projects', 'Is he into cyber security?', 'What web skills does he have?'] },

    'p-fin': { label: 'the financing app',
      keys: ['financing', 'finance', 'loan', 'loans', 'confidential', 'private project'], soft: ['private'],
      a: `**Financing Application** — a full-stack system for managing financing operations.`,
      more: `It handles a **secure back-end**, **financing-terms calculation** and **user management**. The details are private under a confidentiality agreement — you can ask Alinor directly at ${EMAIL}.`,
      chips: ['Show me all projects', 'How can I contact him?', 'What web skills does he have?'] },

    'p-lpg': { label: 'the LPG leak detector',
      keys: ['lpg', 'gas', 'leak', 'leakage', 'shutoff', 'gas leak'], soft: ['safety'],
      a: `**Smart LPG Gas Leak Detection & Automatic Shutoff** — an IoT safety system for homes and businesses.`,
      more: `When the gas sensor detects a leak, it triggers three responses at once: a **motor closes the cylinder valve**, the user gets a **real-time SMS alert**, and a **piezo buzzer** sounds an alarm.`,
      how: `A gas sensor monitors the air; on detection the controller drives a motor to shut the LPG valve, sends an SMS alert and sounds a buzzer — a multi-layered response so nobody misses it.`,
      chips: ['How does it work?', 'Tell me about the irrigation project', 'Show me all projects'] },

    'p-irr': { label: 'the smart irrigation project',
      keys: ['irrigation', 'farm', 'farmer', 'farmers', 'soil', 'moisture', 'agriculture', 'water pump'], soft: ['plants', 'crops'],
      a: `**Smart Water Irrigation** — a system designed to help local farmers save water.`,
      more: `**Soil-moisture sensors** switch on the water pump **only when the soil is dry**, which saves water and helps crops grow.`,
      how: `Sensors read soil moisture continuously; when it drops below the dry threshold the pump turns on, and it turns off once the soil is moist again.`,
      chips: ['How does it work?', 'Tell me about the flood monitor', 'Show me all projects'] },

    'p-flood': { label: 'the flood monitor',
      keys: ['flood', 'water level', 'flooding'], soft: ['rain', 'alert'],
      a: `**Web-Integrated Flood Monitor** — hardware plus a web dashboard.`,
      more: `**Water-level sensors** detect rising water and send **real-time data to a web dashboard**; when levels hit critical, the website sends an **alert message**.`,
      how: `The sensors push readings to the web app, which charts the level in real time and raises an alert when it crosses the critical threshold.`,
      chips: ['How does it work?', 'Tell me about the tollgate', 'Show me all projects'] },

    'p-durian': { label: 'the durian AI project',
      keys: ['durian', 'ripeness', 'ripe', 'fruit', 'unripe', 'overripe'], soft: ['classify', 'classification'],
      a: `**Durian Ripeness Classification** — a computer-vision system that sorts durians into **unripe, ripe or overripe**.`,
      more: `It uses a **Convolutional Neural Network (CNN)** with image-processing features (**color, texture and structure**), trained on a large set of durian images — useful for agriculture, food quality control and post-harvest management.`,
      how: `Photos of the fruit go through feature extraction (color, texture, structure) and a CNN, with several image transformations during training, to predict the ripeness class.`,
      chips: ['How does it work?', 'Tell me about the Braille project', 'Show me all projects'] },

    'p-braille': { label: 'the Braille AI project',
      keys: ['braille', 'blind', 'visually impaired', 'assistive', 'translator'], soft: ['voice', 'speech'],
      a: `**AI Braille Recognition & Voice-Enabled Translator** — assistive tech for blind learners and educators.`,
      more: `A **camera** captures Braille dot patterns, a **machine-learning model** recognizes the letters, they're combined into **words**, then shown on screen and **read aloud** through a speaker.`,
      how: `Camera → ML model recognizes each Braille cell → letters are joined into words → the text is displayed and spoken, for faster, more natural communication and learning.`,
      chips: ['How does it work?', 'Tell me about the durian project', 'Show me all projects'] },

    'p-toll': { label: 'the tollgate project',
      keys: ['toll', 'tollgate', 'rfid', 'raspberry', 'raspberry pi', 'barrier', 'toll gate'], soft: ['cash lane', 'lane'],
      a: `**Automatic Tollgate (RFID + Cash)** — a working dual-lane tollgate prototype built on a **Raspberry Pi 4B**.`,
      more: `It uses an **MFRC522 RFID reader**, a **servo barrier**, I2C LCD screens and status LEDs. RFID tags are checked against **Firebase Realtime Database**, toll fees are deducted and transactions logged; a **web dashboard** lets attendants confirm cash payments and manage accounts.`,
      how: `A car taps an RFID tag → the Pi verifies it in Firebase → deducts the fee, logs it and lifts the servo barrier, with feedback on the LCD. Cash-lane payments are confirmed by an attendant through the web dashboard, and everything syncs to the cloud.`,
      chips: ['How does it work?', 'Is he into networking?', 'Show me all projects'] },

    ai: { label: 'his AI work',
      keys: ['ai', 'machine learning', 'ml', 'cnn', 'computer vision', 'deep learning', 'neural', 'artificial intelligence', 'ai projects', 'ai experience', 'model'], soft: ['vision', 'smart'],
      a: `Alinor works on **AI for computer vision**: a CNN-based **durian ripeness classifier** and an **AI Braille recognition + voice translator**. He's actively expanding his AI knowledge to apply it to real-world problems.`,
      more: `The durian model uses color, texture and structural features with a CNN; the Braille system recognizes dot patterns from a camera, builds words and reads them aloud.`,
      offer: { q: 'Want details on the Braille project?', to: 'p-braille', kind: 'more' },
      chips: ['Tell me about the Braille project', 'Tell me about the durian project', 'What are his skills?'] },

    iot: { label: 'his IoT work',
      keys: ['iot', 'embedded', 'sensor', 'sensors', 'arduino', 'microcontroller', 'automation', 'internet of things'], soft: ['hardware project', 'device'],
      a: `Alinor's IoT / embedded builds: **LPG leak detection with auto shutoff**, **smart irrigation**, a **web-integrated flood monitor**, and a **Raspberry Pi RFID tollgate** with Firebase cloud sync. He also freelances on embedded systems.`,
      more: `What ties them together: real sensors and actuators (gas, soil moisture, water level, RFID, servo, motor) connected to software — SMS alerts, web dashboards and cloud databases.`,
      offer: { q: 'Want to hear how the tollgate works?', to: 'p-toll', kind: 'how' },
      chips: ['Tell me about the tollgate', 'Tell me about the LPG project', 'Is he into networking?'] },

    contact: { label: 'how to contact him',
      keys: ['contact', 'email', 'e mail', 'phone number', 'number', 'call', 'reach', 'message him', 'get in touch', 'gmail', 'mobile number', 'reach him'], soft: ['talk', 'text'],
      a: `You can reach Alinor at:\n• 📧 ${EMAIL}\n• 📞 ${PHONE}\n• 📍 Cagayan de Oro, Philippines\n\nOr use the contact form at the bottom of this page.`,
      moreQ: "Want his social profiles too?",
      more: `He's also on GitHub, LinkedIn and Facebook — the icons are at the top of the page.`,
      chips: ['Is he available for work?', 'Can I see his resume?', 'Who is Alinor?'] },

    loc: { label: 'where he is based',
      keys: ['where', 'location', 'located', 'based', 'address', 'cagayan', 'cdo', 'philippines', 'where is he from', 'where does he live', 'where is he based'], soft: ['from', 'live', 'lives', 'city'],
      a: `Alinor is based in **Cagayan de Oro, Philippines**.`,
      moreQ: "Want to know about remote or on-site work?",
      more: `For on-site, remote or hybrid arrangements, it's best to ask him directly at ${EMAIL}.`,
      chips: ['Is he available for work?', 'How can I contact him?', 'Who is Alinor?'] },

    avail: { label: 'his availability',
      keys: ['available', 'availability', 'open to', 'opportunities', 'hiring', 'hire', 'recruit', 'job offer', 'looking for work', 'freelance', 'open for work', 'open to work'], soft: ['work with'],
      a: `Yes — Alinor is **open to opportunities**, especially in **cyber security, network engineering and web development**.`,
      moreQ: "Want to know about freelance work too?",
      more: `He also takes **freelance** IoT and full-stack web projects. Best way to start: ${EMAIL} or ${PHONE}.`,
      offer: { q: 'Want his contact details?', to: 'contact' },
      chips: ['How can I contact him?', 'Can I see his resume?', 'Why should we hire him?'] },

    resume: { label: 'his resume',
      keys: ['resume', 'cv', 'curriculum vitae'], soft: [],
      a: `Here's Alinor's resume: <a href="${RESUME}" target="_blank" rel="noopener">Alinor Casidar — Resume (PDF)</a>.`,
      chips: ['How can I contact him?', 'Why should we hire him?', 'What are his skills?'] },

    why: { label: 'why to hire him',
      keys: ['why hire', 'why should', 'strength', 'strengths', 'qualities', 'what makes', 'unique', 'stand out', 'best quality', 'advantage'], soft: ['best'],
      a: `What sets Alinor apart:\n• He works on **both hardware and software** — and connects them (IoT + web + cloud)\n• **6+ years** of real troubleshooting experience\n• He's shipped real systems: e-commerce, a government-agency Flutter app, AI vision projects\n• Quick learner, good under pressure, works well in teams`,
      more: `In short: he can take a problem from the circuit board all the way to the web dashboard — and he's eager to keep learning.`,
      offer: { q: 'Want his contact details?', to: 'contact' },
      chips: ['How can I contact him?', 'Can I see his resume?', 'Show me his projects'] },

    weak: { label: 'areas he’s growing in',
      keys: ['weakness', 'weaknesses', 'weak', 'improve', 'improvement', 'lacking'], soft: [],
      a: `I don't have a list of weaknesses from Alinor. What I can tell you honestly: **cyber security** and **network engineering** are fields he's growing into — building on his networking and hardware foundation — and he describes himself as always eager to learn.`,
      chips: ['Why should we hire him?', 'Is he into cyber security?', 'How can I contact him?'] },

    soft: { label: 'his soft skills',
      keys: ['soft skills', 'teamwork', 'team player', 'team', 'communication', 'personality', 'attitude', 'pressure', 'leadership'], soft: ['people'],
      a: `Alinor's soft skills: **problem-solving**, **critical thinking**, **quick learner**, **teamwork and cooperation**, **willingness to learn and grow**, and **handling pressure**.`,
      chips: ['Why should we hire him?', 'What are his skills?', 'How can I contact him?'] },

    cert: { label: 'certifications',
      keys: ['certification', 'certifications', 'certificate', 'certificates', 'certified', 'ccna', 'comptia', 'license', 'board exam'], soft: [],
      a: `No certifications are listed in Alinor's portfolio. For anything recent, it's best to ask him at ${EMAIL}.`,
      chips: ['What are his skills?', 'Tell me about his education', 'How can I contact him?'] },

    remote: { label: 'work arrangement',
      keys: ['remote', 'work from home', 'wfh', 'onsite', 'on site', 'hybrid', 'relocate', 'relocation'], soft: [],
      a: `His portfolio doesn't say whether he prefers remote, on-site or hybrid work. He's based in **Cagayan de Oro** — best to ask him directly at ${EMAIL}.`,
      chips: ['Is he available for work?', 'How can I contact him?', 'Where is he based?'] },

    salary: { label: 'salary',
      keys: ['salary', 'rate', 'rates', 'price', 'pricing', 'how much', 'pay', 'expected salary', 'compensation'], soft: ['cost'],
      a: `Salary and rates are best discussed with Alinor directly — ${EMAIL}.`,
      chips: ['How can I contact him?', 'Is he available for work?', 'Can I see his resume?'] },

    personal: { label: 'personal details',
      keys: ['age', 'how old', 'birthday', 'married', 'girlfriend', 'boyfriend', 'single', 'religion', 'height', 'family', 'favorite food', 'favourite'], soft: [],
      a: `I keep personal details private — I'm here for Alinor's work. For anything personal, feel free to ask him directly at ${EMAIL}.`,
      chips: ['Who is Alinor?', 'What are his skills?', 'Show me his projects'] },

    hobby: { label: 'his interests',
      keys: ['hobby', 'hobbies', 'free time', 'fun', 'interests', 'interest', 'passion', 'passionate', 'enjoy', 'like to do', 'loves'], soft: [],
      a: `Alinor enjoys coding and exploring new technologies — especially building systems where **hardware is controlled through apps and websites**.`,
      more: `His career interests also include instructional design, e-learning and LMS, UI/UX, digital content creation, data analytics, software engineering and information-system analysis.`,
      chips: ['Show me his projects', 'What are his skills?', 'What roles is he aiming for?'] },

    bot: { label: 'me',
      keys: ['are you ai', 'are you a bot', 'are you real', 'are you human', 'who made you', 'who built you', 'how do you work', 'what are you', 'chatgpt', 'claude', 'who are you', 'your name', 'are you a robot'], soft: [],
      a: `I'm **ALINOR.AI**, the assistant built into Alinor's portfolio. I answer questions about his skills, projects, experience and goals using what he's shared. For anything I can't answer, email him at ${EMAIL}.`,
      chips: ['Who is Alinor?', 'What are his skills?', 'Show me his projects'] }
  };
  const DEFAULT_CHIPS = ['Who is Alinor?', 'What are his skills?', 'Show me his projects', 'How can I contact him?', 'Is he into cyber security?', 'Tell me about his DILG internship'];

  /* ======================= LANGUAGE HELPERS ======================= */
  const norm = s => (s || '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9+#ñ\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = n => n ? n.split(' ').length : 0;
  const cap = s => s[0].toUpperCase() + s.slice(1).toLowerCase();

  // every keyword word becomes part of the vocabulary used to fix typos ("skils" → skills)
  const VOCAB = new Set();
  for (const t of Object.values(T)) for (const k of [...t.keys, ...t.soft]) for (const w of k.split(' ')) if (w.length >= 4) VOCAB.add(w);
  // ordinary words that must never be "corrected" into a keyword (show → shop, there → where, next → text …)
  const KEEP = new Set(('about above after again along also always another anyone anything around asked asking because before being better between brief could daily didnt doesnt doing during either every first found getting given going great group happy having hello helps their there these thing things think those three through today under until using wants where which while whole whose would wrong years yours show shows shown know knows next text name names tell tells good nice sure please really thanks thank maybe still other others place point right since small start state story style taken takes tried truly trust worth write wrote interested interesting recruiter recruiters company student students person looking share shared share sound sounds great cases price prices pretty quite quick quickly sorry hours house horse mouse court count share stuff share where whats wheres heres theres thats youre thing').split(' '));
  // Damerau (optimal string alignment) distance — a swapped pair of letters counts as one typo
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const d = [];
    for (let i = 0; i <= a.length; i++) d[i] = [i];
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
    return d[a.length][b.length];
  }
  const fixCache = new Map();
  function fixWord(w) {
    if (w.length < 5 || VOCAB.has(w) || KEEP.has(w) || /\d/.test(w)) return w;
    if (fixCache.has(w)) return fixCache.get(w);
    let out = w;
    if (w.endsWith('s') && VOCAB.has(w.slice(0, -1))) out = w.slice(0, -1);
    else {
      const max = w.length >= 8 ? 2 : 1; let bd = max + 1;
      for (const v of VOCAB) { const d = dist(w, v, max); if (d < bd) { bd = d; out = v; } }
      if (bd > max) out = w;
    }
    fixCache.set(w, out); return out;
  }
  const correct = n => n.split(' ').map(fixWord).join(' ');

  function scoreAll(n) {
    const s = ' ' + n + ' ', out = [];
    for (const [id, t] of Object.entries(T)) {
      let sc = 0;
      for (const k of t.keys) if (s.includes(' ' + k + ' ')) sc += k.includes(' ') ? 3 : 2;
      for (const k of t.soft) if (s.includes(' ' + k + ' ')) sc += 1;
      if (id.startsWith('p-')) sc *= 1.5; else if (id === 'ai' || id === 'iot') sc *= 1.25;
      if (sc > 0) out.push([id, sc]);
    }
    return out.sort((a, b) => b[1] - a[1]);
  }

  /* ======================= CONVERSATION ENGINE ======================= */
  const R = {
    greet: /^(hi+|hello+|helo|hey+|yo|hiya|howdy|greetings|good (morning|afternoon|evening|day)|maayong (buntag|hapon|gabii|udto)|hola|sup|whats up|wassup)\b/,
    howru: /\b(how are you|how r u|how are u|hows it going|how is it going|how do you do|how have you been|hows your day|kumusta|kamusta|musta)\b/,
    thanks: /\b(thanks|thank you|thank u|thx|ty|tysm|salamat|appreciate it)\b/,
    bye: /\b(bye|goodbye|good bye|see you|see ya|ingat|paalam|thats all|that is all|im done|nothing else)\b/,
    meet: /\b(nice to meet you|nice meeting you|pleased to meet you)\b/,
    laugh: /^(lol|haha+|hehe+|hihi+|lmao|xd|rofl)\b/,
    joke: /\b(joke|jokes|make me laugh|something funny)\b/,
    compliment: /^(nice|cool|awesome|great|amazing|impressive|wow+|galing|ang galing|ganda|nindot|good job|well done|perfect|love it|very good|so cool|beautiful|wonderful)\b|^(this|that|it|its|thats|the site|your site|the website|the design|this site|this portfolio)( is| looks)? (so |very |really )?(great|nice|cool|awesome|amazing|impressive|beautiful|good|clean|lovely)\b/,
    ack: /^(ok|okay|k|kk|alright|all right|i see|got it|noted|understood|sige|ah+|oh+|hmm+|right|fine|good|cool cool|makes sense)$/,
    okay: /^(ok|okay|k|alright|all right|sige|go|go on)$/,
    doubt: /\b(you sure|are you sure|r u sure|sure ka|really|for real|is that true|is it true|legit|seriously|totoo|tinuod|no way|are you certain)\b/,
    more: /^(tell me more|more|more please|more info|more details|elaborate|explain|explain more|go on|continue|and|and then|what else|anything else|details|expound|keep going|then|next|unsa pa|ano pa)\b/,
    why: /^(why|how come|bakit|ngano)\b/,
    how: /^(how\s*$|how so|how does (it|that|this) work|how did (he|it|they)|how was (it|that|this)|how is (it|that|this) (made|built|done)|how it works)/,
    yes: /^(yes|yeah|yea|yep|yup|ya|sure|of course|ofc|please|yes please|go ahead|oo|opo|sige|definitely|absolutely|why not|tell me$|do it|i want$|i do|ok sure|okay sure)\b/,
    no: /^(no|nope|nah|not now|no thanks|no thank you|hindi|dili|ayaw|not really|maybe later|later|im good)\b/,
    help: /\b(help|what can you do|what can i ask|what do you know|what should i ask|options|menu)\b/,
    recruiter: /\b(recruiter|hr|hiring manager|talent acquisition|we are hiring|were hiring|im hiring|our company)\b/
  };
  const STOP_NAMES = new Set('a an the looking interested from here just not fine good okay ok so very sorry done back curious hiring glad happy bored lost confused impressed recruiter student also still really trying asking wondering ready sure great doing well new alinor awesome amazing nice cool impressive perfect going interesting'.split(' '));
  const MORE_Q = ['Want more detail?', 'Want me to go deeper?', 'Should I tell you more?'];
  const GENERIC = new Set(['projects', 'exp', 'who']); // vague topics that "it / that project" usually refers past
  const PRON = /\b(it|that|this|those|them|the project|this project|that project|the app|the system)\b/;

  function newState() { return { last: null, given: {}, offer: null, name: null }; }

  // answer one topic at a depth: 'a' (overview), 'more', 'why' or 'how' — and end with a natural offer
  function answerTopic(st, id, kind = 'a', lead = '') {
    const t = T[id]; let k = kind;
    if (k !== 'a' && !t[k]) {
      if (t.more && !st.given[id + ':more']) k = 'more';
      else {
        st.last = id; st.offer = null;
        const msg = kind === 'why' ? `I don't have his reasons for that in his portfolio — you could ask Alinor directly at ${EMAIL}.`
          : kind === 'how' ? `I don't have more technical detail on ${t.label} than that. For specifics, ask Alinor at ${EMAIL}.`
          : `That's everything I have on ${t.label} right now. For more, ask Alinor directly at ${EMAIL} — or pick a related topic below.`;
        return { text: msg, chips: t.chips || DEFAULT_CHIPS };
      }
    }
    if (k !== 'a' && st.given[id + ':' + k]) {
      st.last = id; st.offer = null;
      return { text: `That's everything I have on ${t.label} right now. For more, ask Alinor directly at ${EMAIL} — or pick a related topic below.`, chips: t.chips || DEFAULT_CHIPS };
    }
    if (k === 'a' && st.given[id + ':a'] && !lead) lead = pick(['As I mentioned:\n', 'Sure — here it is again:\n']);
    let text = t[k];
    st.given[id + ':' + k] = true; st.last = id;
    const moreOffer = t.more ? { to: id, kind: 'more', q: t.moreQ } : null;
    const cands = k === 'a' ? [t.offer, moreOffer] : [moreOffer, t.offer];
    const o = cands.find(c => c && !st.given[c.to + ':' + (c.kind || 'a')]);
    st.offer = o ? { ...o, q: o.q || pick(MORE_Q) } : null;
    if (st.offer) text += '\n\n' + st.offer.q;
    return { text: lead + text, chips: t.chips || DEFAULT_CHIPS };
  }

  function respond(q, st) {
    const raw = (q || '').trim(), n0 = norm(raw);
    if (!raw) return { text: 'Ask me anything about Alinor — his skills, projects, experience or goals.', chips: DEFAULT_CHIPS };
    if (!n0) return { text: '😊 Ask me anything about Alinor — his skills, projects, experience or goals.', chips: DEFAULT_CHIPS.slice(0, 4) };

    // the visitor introduces themself: "my name is Ana", "call me Ana", "I'm Ana"
    const nm = n0.match(/\b(?:my name is|my names|call me|ako si|i am called)\s+([a-zñ]{2,20})\b/) ||
      raw.replace(/[’']/g, '').match(/\b(?:[Ii]\s*[Aa]m|[Ii]m|[Tt]his is)\s+([A-ZÑ][a-zñ]{1,19})\b/);
    if (nm && !STOP_NAMES.has(nm[1].toLowerCase())) {
      st.name = cap(nm[1]);
      const rest = n0.replace(new RegExp('\\b(my name is|my names|call me|ako si|i am called|i am|im|this is)\\s+' + nm[1].toLowerCase() + '\\b'), ' ')
        .replace(/^\s*(hi+|hello+|hey+|good (morning|afternoon|evening))\b/, '').replace(/\s+/g, ' ').trim();
      const pre = `Nice to meet you, ${st.name}! 👋 `;
      const sc = scoreAll(correct(rest));
      if ((sc[0] && sc[0][1] >= 2) || R.recruiter.test(rest) || R.help.test(rest)) { const r = core(rest, st, raw); r.text = pre + r.text; return r; }
      return { text: pre + `I'm **ALINOR.AI**. Ask me anything about Alinor — his skills, projects, internship or career goals.`, chips: DEFAULT_CHIPS.slice(0, 4) };
    }
    return core(n0, st, raw);
  }

  function core(n0, st, raw) {
    const n = correct(n0), w = words(n0), hi = st.name ? `, ${st.name}` : '';
    const scores = scoreAll(n);
    const top = scores[0] ? scores[0][0] : null;
    let topical = !!top && scores[0][1] >= 2;
    // "how was this project made?" right after the tollgate → it's about the tollgate, not the project list
    if (topical && st.last && PRON.test(n0) && GENERIC.has(top) && top !== st.last && scores[0][1] <= 3) topical = false;

    // recruiters get a quick summary
    if (R.recruiter.test(n0) && (!topical || top === 'avail' || top === 'who')) {
      st.last = 'avail'; st.offer = { to: 'resume', q: 'Want his resume?' };
      return { text: `Great to have you here${hi}! A quick summary:\n• **Computer Engineering graduate** (USTP), based in Cagayan de Oro\n• Target roles: **Cyber Security, Network Engineering, Web Development**\n• IT Intern | Developer at **DILG Region X** · **6+ years** hardware repair · freelance IoT & web projects\n• **Open to opportunities** — ${EMAIL}\n\nWant his resume?`, chips: ['Can I see his resume?', 'Why should we hire him?', 'Show me his projects'] };
    }

    if (!topical && R.howru.test(n0)) {
      if (/kumusta|kamusta|musta/.test(n0)) return { text: `Mabuti naman, salamat${hi}! 😊 I'm ALINOR.AI — what would you like to know about Alinor?`, chips: DEFAULT_CHIPS.slice(0, 4) };
      return { text: pick([`I'm doing great${hi}, thanks for asking! 😊 What would you like to know about Alinor?`, `All good here${hi}! How can I help — his skills, projects, or how to reach him?`]), chips: DEFAULT_CHIPS.slice(0, 4) };
    }
    if (!topical && R.meet.test(n0)) return { text: `Nice to meet you too${hi}! 😊 What would you like to know about Alinor?`, chips: DEFAULT_CHIPS.slice(0, 4) };

    // follow-ups about whatever we were just talking about
    if (!topical && w <= 6) {
      if (R.doubt.test(n0)) {
        if (!st.last) return { text: `Yes — everything I share comes straight from Alinor's own portfolio and resume. What would you like to know?`, chips: DEFAULT_CHIPS.slice(0, 4) };
        const t = T[st.last], canMore = t.more && !st.given[st.last + ':more'];
        st.offer = canMore ? { to: st.last, kind: 'more', q: '' } : null;
        return { text: `${pick(['Yes, I’m sure!', 'Yep, I’m sure.', 'Yes — 100%.'])} What I told you about ${t.label} comes straight from Alinor's own portfolio and resume — I don't make things up.\n\n${canMore ? `Want me to go deeper on ${t.label}?` : `If you'd like to double-check anything, you can ask him directly at ${EMAIL}.`}`, chips: t.chips || DEFAULT_CHIPS };
      }
      const whyNot = st.offer && /^why not\b/.test(n0);
      if (R.more.test(n0)) {
        if (!st.last) return { text: `Happy to! What would you like to know more about — his **skills**, **projects**, **experience** or **goals**?`, chips: DEFAULT_CHIPS.slice(0, 4) };
        return answerTopic(st, st.last, 'more');
      }
      if (R.why.test(n0) && !whyNot) {
        if (!st.last) return { text: `Why what? 🙂 Ask me about something first — like his career goals — and I'll explain the why.`, chips: ['What roles is he aiming for?', 'Who is Alinor?'] };
        return answerTopic(st, st.last, 'why');
      }
      if (R.how.test(n0)) {
        if (!st.last) return { text: `How what? 🙂 Pick a project and I'll explain how it works.`, chips: ['Tell me about the tollgate', 'Tell me about the Braille project', 'Show me his projects'] };
        return answerTopic(st, st.last, /^how so\b/.test(n0) ? 'more' : 'how');
      }
      if (st.offer && (R.yes.test(n0) || R.okay.test(n0) || whyNot)) { const o = st.offer; st.offer = null; return answerTopic(st, o.to, o.kind || 'a'); }
      if (R.no.test(n0)) { st.offer = null; return { text: pick([`No problem${hi}! What else would you like to know?`, `Okay! Ask me anything else about Alinor.`]), chips: DEFAULT_CHIPS.slice(0, 4) }; }
      if (R.yes.test(n0)) {
        if (st.last && T[st.last].more && !st.given[st.last + ':more']) return answerTopic(st, st.last, 'more');
        return { text: `Great! What would you like to know${hi}? Try his **skills**, **projects** or **career goals**.`, chips: DEFAULT_CHIPS.slice(0, 4) };
      }
    }

    // small talk
    if (!topical && w <= 7) {
      const g = n0.match(R.greet);
      if (g) {
        const m = n0.match(/^(good|maayong) (\w+)/);
        const opener = m ? `${cap(m[1])} ${m[2]}${hi}! 👋` : pick([`Hi${hi}! 👋`, `Hello${hi}! 👋`, `Hey${hi}! 👋`]);
        return { text: `${opener} ${pick([`I'm ALINOR.AI. Ask me about Alinor's **skills**, **projects**, **experience**, **career goals**, or how to **contact** him.`, `What would you like to know about Alinor?`, `I can tell you about Alinor's work, projects and goals. Where should we start?`])}`, chips: DEFAULT_CHIPS.slice(0, 4) };
      }
      if (R.thanks.test(n0)) return { text: /salamat/.test(n0) ? `Walang anuman${hi}! 😊 Anything else you'd like to know?` : pick([`You're welcome${hi}! Anything else you'd like to know?`, `Anytime! 😊 Want to see his projects or his contact details?`]), chips: ['Show me his projects', 'How can I contact him?', 'Is he available for work?'] };
      if (R.bye.test(n0)) { st.offer = null; return { text: `Thanks for stopping by${hi}! 👋 If you'd like to reach Alinor: ${EMAIL} · ${PHONE}.`, chips: ['How can I contact him?'] }; }
      if (R.laugh.test(n0)) return { text: `😄 Glad you're enjoying it! Anything you'd like to know about Alinor?`, chips: DEFAULT_CHIPS.slice(0, 3) };
      if (R.joke.test(n0)) {
        st.offer = { to: 'net', q: '' };
        return { text: `${pick(['Why did the network engineer bring a ladder to work? To reach the **higher layers** of the OSI model.', 'Why do programmers prefer dark mode? Because light attracts **bugs**.', 'There are 10 kinds of people: those who understand **binary** and those who don\'t.'])} 😄\n\nSpeaking of tech — want to hear about Alinor's networking experience?`, chips: ['Is he into networking?', 'What are his skills?', 'Show me his projects'] };
      }
      if (R.compliment.test(n0)) { st.offer = { to: 'projects', q: '' }; return { text: pick([`Thank you! 😊 Want to see what Alinor has built?`, `Glad you like it! Want to hear about his projects?`]), chips: ['Show me his projects', 'Who is Alinor?'] }; }
      if (R.help.test(n0)) return { text: `I can tell you about Alinor's **background**, **skills**, **projects**, **DILG internship**, **career goals**, **resume** and **contact details**.\n\nFollow-ups work too — try “tell me more”, “why?” or “how does it work?” after any answer.`, chips: DEFAULT_CHIPS.slice(0, 4) };
      if (R.ack.test(n0)) return { text: pick([`👍 Anything else you'd like to know?`, `Got it! Ask me about his projects, skills or how to reach him.`]), chips: st.last ? (T[st.last].chips || DEFAULT_CHIPS) : DEFAULT_CHIPS.slice(0, 4) };
    }

    // a real question about one (or two) topics
    if (topical) {
      const lead = R.greet.test(n0) ? pick(['Hi! 👋 ', 'Hello! 👋 ']) : '';
      const second = scores[1];
      const both = second && second[1] >= 2 && second[1] >= scores[0][1] * .7 && (/\b(and|also|plus|or)\b/.test(n0) || /[,&]/.test(raw));
      if (both) {
        const a = T[top], b = T[second[0]];
        st.given[top + ':a'] = st.given[second[0] + ':a'] = true; st.last = second[0]; st.offer = null;
        return { text: `${lead}${a.a}\n\n—\n\n${b.a}`, chips: [...new Set([...(a.chips || []), ...(b.chips || [])])].slice(0, 3) };
      }
      const kind = /^(why|how come)\b/.test(n0) ? 'why' : /^how (does|did|do|is|was)\b/.test(n0) ? 'how' : 'a';
      if (kind !== 'a' && T[top][kind]) return answerTopic(st, top, kind, lead);
      if (st.given[top + ':a'] && T[top].more && !st.given[top + ':more'] && (top === st.last || R.more.test(n0))) return answerTopic(st, top, 'more', lead);
      return answerTopic(st, top, 'a', lead);
    }

    // "how does that work?", "tell me about it" → the previous topic
    if (st.last && PRON.test(n0)) return answerTopic(st, st.last, /\bhow\b/.test(n0) ? 'how' : /\bwhy\b/.test(n0) ? 'why' : 'more');

    // nothing matched clearly
    st.offer = null;
    if (scores.length) { const r = answerTopic(st, top, 'a'); r.text = `I think you're asking about **${T[top].label}** — here's what I know:\n\n` + r.text; return r; }
    return { text: pick([
      `Hmm, I'm not sure about that one${hi}. I only know about Alinor and his work — try asking about his **skills**, **projects**, **experience** or **career goals**.`,
      `That's outside what I know. I can tell you about Alinor's **projects**, **skills**, **education**, **DILG internship**, or how to **reach him** at ${EMAIL}.`,
      `I don't have that detail in Alinor's portfolio. You can ask him directly at ${EMAIL} — or ask me about his work.`]), chips: DEFAULT_CHIPS.slice(0, 4) };
  }

  // one-shot answer (used by the preview box in the AI section)
  function localAnswer(q) { const r = respond(q, newState()); return r.text.replace(/\n\n[^\n]*\?$/, ''); }

  /* ======================= CHAT UI ======================= */
  const $ = s => document.querySelector(s);
  const panel = $('#aiPanel'), body = $('#aiBody'), input = $('#aiInput'), fab = $('#aiFab'), status = $('#aiStatus');
  const history = []; // {role, content} for the live AI
  const state = newState();
  let busy = false, greeted = false, liveOK = null;

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function render(text) {
    const parts = text.split(/(<a [^>]+>[^<]*<\/a>)/g);
    return parts.map(p => p.startsWith('<a ') ? p : esc(p)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>')
      .replace(/([\w.+-]+@[\w-]+\.[\w.]+)/g, '<a href="mailto:$1">$1</a>')).join('');
  }
  function add(role, html) { const m = document.createElement('div'); m.className = 'msg ' + role; m.innerHTML = html; body.appendChild(m); body.scrollTop = body.scrollHeight; return m; }
  async function typeOut(text) {
    const m = add('bot', ''); const full = render(text);
    const tmp = document.createElement('div'); tmp.innerHTML = full; const plain = tmp.textContent;
    // time-based, so it always finishes in ≤ ~1.4 s even when the browser slows timers down
    const dur = Math.min(1400, 250 + plain.length * 5), t0 = performance.now();
    while (!document.hidden) {
      const k = Math.min(plain.length, Math.ceil(plain.length * (performance.now() - t0) / dur));
      m.textContent = plain.slice(0, k); body.scrollTop = body.scrollHeight;
      if (k >= plain.length) break;
      await new Promise(r => setTimeout(r, 16));
    }
    m.innerHTML = full; body.scrollTop = body.scrollHeight;
  }
  function suggestions(list) {
    const box = $('#aiSugg'); box.innerHTML = '';
    list.slice(0, 3).forEach(q => { const b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.onclick = () => ask(q); box.appendChild(b); });
  }

  async function liveAnswer() {
    if (liveOK === false) return null;
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 25000);
      const res = await fetch((window.BASE || '') + 'api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-10) }), signal: ctl.signal });
      clearTimeout(to);
      // 4xx (no /api/chat function, wrong method…) or 501 (no API key) → stop trying for this visit
      if (!res.ok) { if (res.status < 500 || res.status === 501) liveOK = false; return null; }
      const out = await res.json();
      if (out && typeof out.reply === 'string' && out.reply.trim()) { liveOK = true; return out.reply.trim(); }
      return null;
    } catch { liveOK = false; return null; }
  }

  async function ask(q) {
    q = (q || '').trim(); if (!q || busy) return;
    open(); busy = true; input.value = '';
    add('me', esc(q)); history.push({ role: 'user', content: q });
    const dots = add('bot typing', '<i></i><i></i><i></i>');
    let reply = await liveAnswer(), chips = null;
    const source = reply ? 'live' : 'local';
    if (!reply) {
      await new Promise(r => setTimeout(r, 350 + Math.random() * 350));
      const r = respond(q, state);
      reply = r.text; chips = r.chips;
    }
    dots.remove();
    history.push({ role: 'assistant', content: reply.replace(/<[^>]+>/g, '') });
    status.textContent = source === 'live' ? 'online · live AI' : 'online · answers about Alinor';
    await typeOut(reply);
    busy = false;
    suggestions((chips || DEFAULT_CHIPS).filter(s => s.toLowerCase() !== q.toLowerCase()));
  }

  function open() {
    panel.classList.add('open'); fab.classList.add('hidden');
    if (!greeted) { greeted = true; typeOut(`Hi! 👋 I'm **ALINOR.AI**, Alinor's portfolio assistant. Ask me anything about his skills, projects, experience or career goals — follow-up questions are welcome too.`); suggestions(DEFAULT_CHIPS); }
    setTimeout(() => input.focus({ preventScroll: true }), 300);
  }
  function close() { panel.classList.remove('open'); fab.classList.remove('hidden'); }

  document.addEventListener('click', e => { const b = e.target.closest('[data-open-ai]'); if (b) { e.preventDefault(); open(); } });
  $('#aiClose').onclick = close;
  $('#aiForm').addEventListener('submit', e => { e.preventDefault(); ask(input.value); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });

  /* section: question chips + live preview */
  const qc = $('#qchips');
  ['Who is Alinor?', 'What did he do at DILG?', 'Is he into cyber security?', 'Tell me about the tollgate project', 'How can I contact him?'].forEach(q => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = '› ' + q; b.onclick = () => ask(q); qc.appendChild(b);
  });
  const demoEl = $('#aiDemo');
  const DEMO = ['What are his skills?', 'Is he into cyber security?', 'Where is he based?'];
  let demoStarted = false;
  new IntersectionObserver(es => { if (es[0].isIntersecting && !demoStarted) { demoStarted = true; runDemo(); } }, { threshold: .3 }).observe(demoEl);
  async function runDemo() {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    for (let i = 0; ; i = (i + 1) % DEMO.length) {
      demoEl.innerHTML = ''; const q = document.createElement('div'); q.innerHTML = '<span style="color:var(--a)">you › </span>'; demoEl.appendChild(q);
      const qs = document.createElement('span'); q.appendChild(qs);
      for (const ch of DEMO[i]) { qs.textContent += ch; await wait(40); }
      await wait(400);
      const a = document.createElement('div'); a.style.marginTop = '12px'; a.innerHTML = '<span style="color:var(--a)">alinor.ai › </span>'; demoEl.appendChild(a);
      const as = document.createElement('span'); a.appendChild(as);
      const txt = (() => { const d = document.createElement('div'); d.innerHTML = render(localAnswer(DEMO[i])); return d.textContent; })();
      for (let k = 0; k < txt.length; k += 3) { as.textContent = txt.slice(0, k + 3); await wait(12); }
      await wait(4200);
    }
  }

  window.AlinorAI = { ask, open, localAnswer, respond, newState };
})();
