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
      why: `From his portfolio: he was inspired by his **father, who was also a technician**, and he enjoys building systems where **hardware is controlled through apps and websites**.`,
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
      more: `As a freelancer he combines hardware and software — IoT embedded systems plus full-stack web solutions. His 6+ years of repair work go down to motherboard-level troubleshooting.`,
      offer: { q: 'Want details on his DILG internship?', to: 'intern' },
      chips: ['Tell me about his internship', 'Tell me about his hardware work', 'What are his skills?'] },

    hw: { label: 'his hardware work',
      keys: ['hardware', 'repair', 'technician', 'fix', 'fixing', 'motherboard', 'laptop', 'cellphone', 'mobile repair', 'reformat', 'troubleshooting', 'electronics'], soft: ['phone', 'computer', 'pc', 'device'],
      a: `Alinor has **6+ years** as a hardware technician — inspired by his father, who was also a technician. He repairs computers, laptops and mobile devices: reformatting, hardware diagnostics, **motherboard-level troubleshooting** and complex mobile repairs.`,
      more: `He built those skills through hands-on work, self-study and solving problems on his own. He also enjoys building systems where **hardware is controlled through apps and websites** — which is where his IoT projects come from.`,
      why: `He was inspired by his **father, who was also a technician** — then built the skill through hands-on work and self-study.`,
      offer: { q: 'Want to see his IoT projects?', to: 'iot' },
      chips: ['Show me his IoT projects', 'Is he into networking?', 'How can I contact him?'] },

    goal: { label: 'his career goals',
      keys: ['goal', 'goals', 'career', 'aspire', 'aspiring', 'aiming', 'future', 'dream', 'want to be', 'target role', 'which role', 'what role', 'roles', 'path', 'paths', 'plans'], soft: ['role', 'position', 'plan', 'looking for'],
      a: `Alinor is aiming for one of three paths:\n1. **Cyber Security**\n2. **Network Engineering**\n3. **Web Development**\n\nHe's open to opportunities in any of the three.`,
      more: `What he brings to each:\n• **Cyber Security** — network troubleshooting, deep system diagnostics, secure logins in his web apps\n• **Network Engineering** — LAN setup and network configuration at DILG Region X, IoT devices synced to the cloud\n• **Web Development** — full-stack sites, a Flutter app, real-time dashboards he's already shipped`,
      why: `He hasn't written his reasons down, so this is just my read: after years of troubleshooting hardware, networks and software, those three look like a natural next step. He'd explain it better himself!`,
      offer: { q: 'Want his contact details?', to: 'contact' },
      chips: ['Tell me about web development', 'Is he into cyber security?', 'How can I contact him?'] },

    sec: { label: 'cyber security',
      keys: ['cyber', 'cybersecurity', 'security', 'secure', 'hacking', 'hacker', 'pentest', 'penetration', 'soc', 'infosec', 'ethical hacking', 'cyber security'], soft: ['protect', 'threat', 'defend'],
      a: `**Cyber Security** is one of Alinor's target careers. The foundation he brings:\n• network troubleshooting & configuration (DILG Region X)\n• deep system and hardware diagnostics (6+ years)\n• secure logins and user management in his web apps\n• problem-solving under pressure`,
      more: `In his projects, security shows up as **secure login and user management** (the dental clinic app and the financing system's secure back-end). He's eager to grow into the field and build on his networking and systems background.`,
      why: `He hasn't said exactly why. My read: someone who spends years finding out why systems fail tends to get curious about protecting them.`,
      offer: { q: 'Want to hear about his network work too?', to: 'net' },
      chips: ['Show me his projects', 'Is he into networking?', 'Is he available for work?'] },

    net: { label: 'networking',
      keys: ['network', 'networking', 'lan', 'router', 'routing', 'switch', 'cisco', 'ip address', 'subnet', 'network engineer', 'network engineering'], soft: ['wifi', 'internet', 'printer', 'connect'],
      a: `**Network Engineering** is another of Alinor's target paths. At DILG Region X he handled **network troubleshooting and basic configuration**, **LAN setup and maintenance**, and printer repair.`,
      more: `His IoT projects show networking in practice too: the **RFID tollgate** syncs with **Firebase Realtime Database**, and the **flood monitor** sends real-time sensor data to a web dashboard.`,
      why: `He hasn't said exactly why. My read: his DILG network work and his cloud-connected IoT builds point that way.`,
      offer: { q: 'Want to hear about the tollgate project?', to: 'p-toll' },
      chips: ['Tell me about the tollgate', 'Show me his IoT projects', 'Is he into cyber security?'] },

    web: { label: 'web development',
      keys: ['web', 'website', 'websites', 'frontend', 'front end', 'backend', 'back end', 'full stack', 'fullstack', 'php', 'javascript', 'html', 'css', 'tailwind', 'web developer', 'web development'], soft: ['developer', 'develop', 'api', 'database', 'coding', 'code'],
      a: `Web development is a big part of Alinor's hands-on work: **HTML / CSS / Tailwind, JavaScript and PHP**, back-end development, **API integration and database management**.\n\nExamples: an e-commerce system for refurbished iPhones/iPads, a dental clinic web app (upcoming), and dashboards for his flood monitor and tollgate.`,
      more: `He's handled responsive front-ends, back-end logic and databases end to end — like **real-time ordering** with a cloud database in the e-commerce system, and the **admin web panel** for the tollgate.`,
      why: `He hasn't said exactly why. My read: he's already built working sites and dashboards, so it fits.`,
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
      how: `Soil-moisture sensors switch the water pump on **only when the soil is dry**.`,
      chips: ['How does it work?', 'Tell me about the flood monitor', 'Show me all projects'] },

    'p-flood': { label: 'the flood monitor',
      keys: ['flood', 'water level', 'flooding'], soft: ['rain', 'alert'],
      a: `**Web-Integrated Flood Monitor** — hardware plus a web dashboard.`,
      more: `**Water-level sensors** detect rising water and send **real-time data to a web dashboard**; when levels hit critical, the website sends an **alert message**.`,
      how: `The water-level sensors send readings to a web dashboard in real time, and when the level is critical the site sends an alert message.`,
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

  /* ======================= HUMAN LAYER =======================
     c    = short, casual first reply ("||" starts a new chat bubble); the longer `a` comes on "tell me more"
     keys = Tagalog / Bisaya ways of asking (added to the topic's keywords) */
  const A = (href, label) => `<a href="${href}"${/^(https?:|resume\/)/.test(href) ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
  const GITHUB = A('https://github.com/alinorcasidar/alinorcasidar', 'GitHub'), LINKEDIN = A('https://www.linkedin.com/in/alinorcasidar/', 'LinkedIn'), FACEBOOK = A('https://www.facebook.com/CasidarAlinor/', 'Facebook');
  const SOCIALS = `• ${GITHUB}\n• ${LINKEDIN}\n• ${FACEBOOK}`;
  const CASUAL = {
    who: { c: `Alinor's a **Computer Engineering** grad from USTP, based in **Cagayan de Oro**.||He's a bit of an all-rounder: websites, mobile apps, IoT gadgets, some AI, plus **6+ years** fixing phones and computers.`, keys: ['sino siya', 'sino si alinor', 'kinsa siya', 'kinsa si alinor', 'kinsa ni siya'] },
    edu: { c: `He finished **Computer Engineering at USTP** (University of Science and Technology of Southern Philippines).`, keys: ['nag aral', 'nag eskwela', 'eskwela', 'iskwela', 'skwela', 'nagtapos'] },
    intern: { c: `He was an **IT Intern | Developer at DILG Region X**.||Part IT support (networks, PCs, printers), part developer: he built their **Citizen's Charter app** in Flutter.` },
    exp: { c: `Short version: **6+ years** of hardware repair, an **IT/dev internship at DILG Region X**, and **freelance** IoT and web projects.`, keys: ['karanasan'] },
    hw: { c: `He's been repairing **phones, laptops and PCs for 6+ years**, down to motherboard level.||His dad was a technician too, that's what inspired him.` },
    goal: { c: `He's got three paths in mind: **cyber security**, **network engineering** or **web development**. He's open to any of them.`, list: ['sec', 'net', 'web'], keys: ['pangarap', 'plano niya', 'gusto niya'] },
    sec: { c: `Yep, **cyber security** is one of the three paths he's aiming for.||He's still growing into it. What he brings: network troubleshooting, system diagnostics, and web apps with secure logins.` },
    net: { c: `**Network engineering** is one of his target paths.||At DILG Region X he did network troubleshooting, basic configuration, and LAN setup and maintenance.` },
    web: { c: `Web dev is a big part of what he does: **HTML/CSS/Tailwind, JavaScript and PHP**, plus APIs and databases.` },
    mobile: { c: `He builds mobile apps with **Flutter**.||The main one is the **DILG X Interactive Information System**, from his internship.` },
    skills: { c: `He's pretty versatile: **web and Flutter apps**, **networks and hardware**, **IoT**, and some **AI vision** work.`, keys: ['kaya niya', 'kaya niyang gawin', 'marunong', 'hanas', 'galing niya'] },
    projects: { c: `Quite a few, **20+** so far.||If you want the good ones first: the **RFID tollgate**, the **AI Braille translator**, and the **refurbished iPhone shop**. Which one?`, list: ['p-toll', 'p-braille', 'p-shop'], keys: ['proyekto', 'ginawa niya', 'gibuhat', 'nagawa niya'] },
    ai: { c: `Mostly computer vision: a **durian ripeness classifier** and a **Braille recognition + voice translator**.`, list: ['p-durian', 'p-braille'] },
    iot: { c: `He's built an **LPG leak detector**, **smart irrigation**, a **flood monitor** and an **RFID tollgate**.`, list: ['p-lpg', 'p-irr', 'p-flood', 'p-toll'] },
    contact: { c: `Easiest way is email: ${EMAIL}||Or call/text ${PHONE}.`, keys: ['makontak', 'ma contact', 'numero', 'paano siya makausap', 'unsaon pag contact'] },
    loc: { keys: ['taga saan', 'tagasaan', 'taga asa', 'saan siya', 'asa siya', 'nakatira', 'saan nakatira'] },
    avail: { c: `Yes, he's **open to opportunities**, especially in cyber security, network engineering and web dev.`, keys: ['naghahanap ng trabaho', 'nangita og trabaho'] },
    why: { c: `He works on **both the hardware and the software**, and knows how to connect them.||Add 6+ years of real troubleshooting and a government-agency app he's shipped, and that's a pretty strong mix.` },
    salary: { keys: ['magkano', 'tagpila', 'pila ang', 'sweldo', 'sahod'] },
    personal: { keys: ['edad', 'ilang taon', 'pila iyang edad', 'jowa', 'may jowa', 'uyab', 'asawa'] },
    bot: { c: `I'm **ALINOR.AI**, an AI assistant on Alinor's portfolio. Not a real person, but I try to talk like one 😄` }
  };
  for (const [id, x] of Object.entries(CASUAL)) { if (x.c) T[id].c = x.c; if (x.list) T[id].list = x.list; if (x.keys) T[id].keys.push(...x.keys); }
  T.contact.more = `He's also on ${GITHUB}, ${LINKEDIN} and ${FACEBOOK}.`;
  T.contact.moreQ = 'Want his GitHub, LinkedIn and Facebook too?';
  T.contact.a = T.contact.c; T.bot.a = T.bot.c;
  const SECTION = { who: 'about', edu: 'about', soft: 'about', hobby: 'about', intern: 'journey', exp: 'journey', hw: 'journey', goal: 'paths', sec: 'paths', net: 'paths', web: 'paths', skills: 'skills', langs: 'skills', projects: 'projects', ai: 'projects', iot: 'projects', mobile: 'projects' };
  const SECNAME = { about: 'About', journey: 'Journey', paths: 'Career paths', skills: 'Skills', projects: 'Projects' };

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
    greet: /^(hi+|hello+|helo|hey+|yo|hiya|howdy|greetings|good (morning|afternoon|evening|day)|maayong (buntag|hapon|gabii|udto)|magandang (umaga|hapon|gabi)|hola|sup|whats up|wassup)\b/,
    howru: /\b(how are you|how r u|how are u|hows it going|how is it going|how do you do|how have you been|hows your day|kumusta|kamusta|musta)\b/,
    thanks: /\b(thanks|thank you|thank u|thx|ty|tysm|salamat|appreciate it)\b/,
    bye: /\b(bye|goodbye|good bye|see you|see ya|ingat|paalam|thats all|that is all|im done|nothing else)\b/,
    meet: /\b(nice to meet you|nice meeting you|pleased to meet you)\b/,
    laugh: /^(lol|haha+|hehe+|hihi+|lmao|xd|rofl)\b/,
    joke: /\b(joke|jokes|make me laugh|something funny)\b/,
    compliment: /^(nice|cool|awesome|great|amazing|impressive|wow+|galing|ang galing|ganda|nindot|good job|well done|perfect|love it|very good|so cool|beautiful|wonderful)\b|^(this|that|it|its|thats|the site|your site|the website|the design|this site|this portfolio)( is| looks)? (so |very |really )?(great|nice|cool|awesome|amazing|impressive|beautiful|good|clean|lovely)\b/,
    ack: /^(ok|okay|k|kk|alright|all right|i see|got it|noted|understood|sige|ah+|oh+|hmm+|right|fine|good|cool cool|makes sense|gets)$/,
    okay: /^(ok|okay|k|alright|all right|sige|go|go on)$/,
    doubt: /\b(you sure|are you sure|r u sure|sure ka|really|for real|is that true|is it true|legit|seriously|totoo|tinuod|no way|are you certain)\b/,
    more: /^(tell me more|more|more please|more info|more details|elaborate|explain|explain more|go on|continue|and|and then|what else|anything else|details|expound|keep going|then|next|unsa pa|ano pa|give me more|give more)\b/,
    why: /^(why|how come|bakit|ngano)\b/,
    how: /^(how\s*$|how so|how does (it|that|this) work|how did (he|it|they)|how was (it|that|this)|how is (it|that|this) (made|built|done)|how it works|paano|giunsa)/,
    yes: /^(yes|yeah|yea|yep|yup|ya|yas|yess+|sure|of course|ofc|please|yes please|go ahead|oo|opo|oum|sige|definitely|absolutely|why not|tell me$|do it|i want$|i do|ok sure|okay sure|g$)\b/,
    no: /^(no|nope|nah|not now|no thanks|no thank you|hindi|dili|ayaw|not really|maybe later|later)\b/,
    help: /\b(help|what can you do|what can i ask|what do you know|what should i ask|options|menu)\b/,
    recruiter: /\b(recruiter|hr|hiring manager|talent acquisition|we are hiring|were hiring|im hiring|our company)\b/,
    give: /^(please |pls |plz |can you |could you |ok |okay |yes |sige |then |so )*(give|send|show|share|provide|drop)( me| us)?( it| them| that| those| all| the links?| links?| the url| his links?)*( please| pls| plz| now| po)?$|^(the )?(links?|url)( please| pls| plz| po)?$|^(pahingi|pengi|penge|patingin|pakita|ihatag|tagai ko|hatag)\b|^(can|may) i (see|have|get) (it|them|that|those|the links?)( please| pls)?$|^where (is|are) (it|they|that|those|the links?)$/,
    repeat: /^(repeat|repeat that|say (it|that) again|again|come again|what did you say|pardon|ulit|usba)\b/,
    simpler: /^(shorter|too long|tldr|tl dr|in short|summarize|make it short|simpler|simple|eli5|i dont (get|understand)( it| that)?|what do you mean|di ko gets|wala ko kasabot|huh|what|ha|ano|unsa)$/,
    upset: /\b(stupid|dumb|useless|bobo|tanga|gago|bogo|idiot|wtf|you suck|hate you|not helpful|unhelpful|bad bot|annoying|not what i asked|you dont understand|doesnt make sense)\b/,
    wrong: /\b(thats wrong|you are wrong|youre wrong|that is wrong|incorrect|mali|sayop)\b/,
    love: /\b(i love you|love you|love u|marry me|date me|are you single|i like you)\b/,
    doing: /\b(what are you doing|wyd|whatcha doing|anong ginagawa mo|unsa imong gibuhat)\b/,
    low: /\b(im|i am|feeling|so) (sad|tired|bored|stressed|lonely|sick)\b|^(pagod|kapoy|bored)\b/,
    time: /\b(what time|time is it|anong oras|unsa oras|unsay oras)\b/,
    date: /\b(what day|what date|date today|todays date|day today)\b/,
    myname: /\b(whats my name|what is my name|who am i|remember me|know my name)\b/,
    myq: /\bwhat did i (ask|say)\b/,
    best: /\b(best|favorite|favourite|coolest|top|most impressive|recommend)\b.*\b(project|projects|one|work)\b|^which (one|project)\b/,
    hireMe: /\b(can|could|will) (he|alinor) (build|make|create|develop|do|fix|repair|help)\b|\bi need (a|an|someone)\b(?! job)|\b(looking for|want) (a|an|someone to)\b.*\b(website|app|system|developer|technician)\b/
  };
  const STOP_NAMES = new Set('a an the looking interested from here just not fine good okay ok so very sorry done back curious hiring glad happy bored lost confused impressed recruiter student also still really trying asking wondering ready sure great doing well new alinor awesome amazing nice cool impressive perfect going interesting later tomorrow maybe now when if please nothing no nope secret why what none yes hello hi hey hmm idk anonymous skip nah wala dili test who how more next visitor guest'.split(' '));
  const GENERIC = new Set(['projects', 'exp', 'who']);
  const PRON = /\b(it|that|this|those|them|the project|this project|that project|the app|the system)\b/;
  const LOCAL_TALK = /\b(siya|niya|sino|saan|paano|magkano|mga|anong|kinsa|unsa|asa|unsaon|iyang|pila|uyab|jowa|taga)\b/; // Tagalog / Bisaya question
  const FILLER = new Set('a an the is are was were be do does did i im me my you your he him his her it its that this what whats which who how why where when can could will would to of in on at for and or with about please pls tell know have has think like want'.split(' '));

  function newState() { return { last: null, kind: null, given: {}, offer: null, name: null, asked: null, list: null, miss: 0, turn: 0, lastAsk: -9, lastText: '', lastQ: '', met: false, jokes: 0 }; }
  const firstKind = t => t.c ? 'c' : 'a';
  // next level of detail not given yet: short reply → full answer → extra detail
  function nextLevel(st, id) {
    const t = T[id], levels = [];
    if (t.c) levels.push('c');
    if (!t.c || t.a !== t.c) levels.push('a');
    if (t.more) levels.push('more');
    return levels.find(k => !st.given[id + ':' + k]);
  }
  const isTalk = n => Object.values(R).some(r => r.test(n));

  // answer a topic: 'first' (short reply), 'more' (next level of detail), 'why' or 'how'
  function answerTopic(st, id, kind = 'first', lead = '') {
    const t = T[id]; let k;
    if (kind === 'a') kind = 'first';
    if (kind === 'first') {
      k = firstKind(t);
      if (st.given[id + ':' + k]) { const nx = nextLevel(st, id); if (nx) k = nx; else lead = lead || pick(['Like I said: ', 'Same as before: ']); }
    } else if (kind === 'more') k = nextLevel(st, id);
    else if (!t[kind]) k = kind === 'why' ? null : nextLevel(st, id);
    else k = st.given[id + ':' + kind] ? null : kind;
    st.last = id;
    if (!k) {
      st.offer = null; st.kind = kind;
      const text = kind === 'why' ? `He hasn't shared his reasons for that, honestly.||You could ask him directly: ${EMAIL}`
        : kind === 'how' ? `That's as technical as I can get on ${t.label} 😅||Alinor can explain the rest: ${EMAIL}`
        : `That's all I've got on ${t.label}.||Want to jump to something related, or ask him at ${EMAIL}?`;
      return { text, chips: t.chips || DEFAULT_CHIPS };
    }
    st.given[id + ':' + k] = true; st.kind = k;
    if (t.list) st.list = t.list;
    const nx = nextLevel(st, id), moreOffer = nx ? { to: id, kind: 'more', q: t.moreQ || pick(['Want more detail?', 'Want the longer version?', 'Should I go on?']) } : null;
    let other = t.offer || null;
    if (other) { const ok = other.kind && other.kind !== 'a' ? other.kind : firstKind(T[other.to]); if (st.given[other.to + ':' + ok]) other = null; }
    st.offer = (k === 'c' || k === 'a') ? ((t.moreQ && moreOffer) || other || moreOffer) : (moreOffer || other);
    let text = lead + t[k];
    // don't end every single message with a question, people don't talk like that
    if (st.offer && !/\?$/.test(t[k].trim()) && (st.turn - st.lastAsk >= 2 || t.moreQ)) { text += '||' + st.offer.q; st.lastAsk = st.turn; }
    return { text, chips: t.chips || DEFAULT_CHIPS };
  }

  // "give me", "send it", "link pls" → hand over the thing we were just talking about
  function give(st) {
    const id = st.last; st.offer = null;
    if (!id) return { text: `Sure! What would you like: his **resume**, **contact details** or **projects**?`, chips: ['Can I see his resume?', 'How can I contact him?', 'Show me his projects'] };
    if (id === 'contact') return { text: `Sure, here you go 👇||${SOCIALS}\n• ${EMAIL}\n• ${PHONE}`, chips: ['Can I see his resume?', 'Is he available for work?', 'Who is Alinor?'] };
    if (id === 'resume' || id === 'avail' || id === 'why') return { text: `Here's his resume 👇||${A(RESUME, 'Alinor Casidar — Resume (PDF)')}${id === 'resume' ? '' : `\nAnd his email: ${EMAIL}`}`, chips: T[id].chips || DEFAULT_CHIPS };
    if (id === 'p-fin') return { text: `I can't share that one, sorry. It's private under a confidentiality agreement.||You can ask him about it: ${EMAIL}`, chips: T[id].chips };
    const s = id.startsWith('p-') ? 'projects' : SECTION[id];
    if (s) { const nx = nextLevel(st, id); st.offer = nx ? { to: id, kind: 'more', q: '' } : null; return { text: `Here you go: ${A('#' + s, SECNAME[s] + ' section')} 👈`, chips: T[id].chips || DEFAULT_CHIPS }; }
    return { text: `I don't have a link for that one, but you can ask him: ${EMAIL}`, chips: T[id].chips || DEFAULT_CHIPS };
  }

  function recruiterReply(st, hi) {
    st.last = 'avail'; st.offer = { to: 'resume', q: 'Want his resume?' };
    return { text: `Oh nice, welcome${hi}! Here's the quick version:||• **Computer Engineering** grad (USTP), Cagayan de Oro\n• Aiming for **Cyber Security, Network Engineering or Web Development**\n• **IT Intern | Developer** at DILG Region X, 6+ years of hardware repair, freelance IoT and web work\n• **Open to opportunities**: ${EMAIL}||Want his resume?`, chips: ['Can I see his resume?', 'Why should we hire him?', 'Show me his projects'] };
  }

  function respond(q, st) {
    st.turn++;
    const raw = (q || '').trim(), n0 = norm(raw);
    let r;
    if (!n0) r = { text: raw ? '😊' : `Go ahead, ask me anything about Alinor.`, chips: DEFAULT_CHIPS };
    else {
      // "my name is Ana", "call me Ana", "I'm Ana", or just "ana" right after I asked
      const nm = n0.match(/\b(?:my name is|my names|call me|ako si|i am called|ngalan ko|pangalan ko)\s+([a-zñ]{2,20})\b/) ||
        raw.replace(/[’']/g, '').match(/\b(?:[Ii]\s*[Aa]m|[Ii]m|[Tt]his is)\s+([A-ZÑ][a-zñ]{1,19})\b/) ||
        (st.asked === 'name' && !isTalk(n0) && !scoreAll(correct(n0)).some(x => x[1] >= 2) && n0.match(/^(?:im |its |i am )?([a-zñ]{2,20})$/));
      if (nm && !STOP_NAMES.has(nm[1].toLowerCase())) {
        st.name = cap(nm[1]); st.asked = null;
        const rest = n0.replace(new RegExp('(?:\\b(?:my name is|my names|call me|ako si|i am called|ngalan ko|pangalan ko|i am|im|its|this is)\\s+)?\\b' + nm[1].toLowerCase() + '\\b'), ' ').replace(/^\s*(hi+|hello+|hey+|good (morning|afternoon|evening))\b/, '').replace(/\s+/g, ' ').trim();
        const pre = `Nice to meet you, ${st.name}! 👋`, sc = scoreAll(correct(rest));
        if ((sc[0] && sc[0][1] >= 2) || R.recruiter.test(rest) || R.help.test(rest)) { r = core(rest, st, raw); r.text = pre + '||' + r.text; }
        else { st.asked = 'purpose'; r = { text: `${pre}||What brings you here? Hiring, a school thing, or just looking around?`, chips: ["I'm a recruiter", 'Just looking around', 'Who is Alinor?'] }; }
      } else r = core(n0, st, raw);
    }
    if (!r.miss) st.miss = 0;
    if (!R.repeat.test(n0)) st.lastText = r.text;
    st.lastQ = n0;
    return r;
  }

  function core(n0, st, raw) {
    const n = correct(n0), w = words(n0), hi = st.name ? `, ${st.name}` : '', asked = st.asked; st.asked = null;
    const start = DEFAULT_CHIPS.slice(0, 4), here = st.last ? (T[st.last].chips || DEFAULT_CHIPS) : start;

    // quick human things that don't need the portfolio
    const sum = raw.replace(/,/g, '').match(/^(?:what(?:['’]?s| is)\s*)?(-?\d+(?:\.\d+)?)\s*([+\-*x×\/÷])\s*(-?\d+(?:\.\d+)?)\s*=?\s*\??$/i);
    if (sum) {
      const x = +sum[1], y = +sum[3], op = sum[2].toLowerCase();
      const v = op === '+' ? x + y : op === '-' ? x - y : /[*x×]/.test(op) ? x * y : y === 0 ? null : x / y;
      return { text: v === null ? `Can't divide by zero, nice try 😄` : `That's **${+v.toFixed(6)}** 😄||Okay, back to Alinor. What would you like to know?`, chips: start };
    }
    if (w <= 8) {
      if (R.upset.test(n0)) { st.offer = null; return { text: `Sorry${hi}, I clearly missed what you meant 😅||Tell me again in a few words? Or pick one below and I'll do better.`, chips: start }; }
      if (R.wrong.test(n0)) return { text: `Ah, sorry about that${hi}. Which part is off?||I only know what's in his portfolio, so Alinor can confirm it: ${EMAIL}`, chips: here };
      if (R.love.test(n0)) return { text: `Haha, I'm flattered${hi}, but I'm just an AI 😄||I can tell you about Alinor's work though!`, chips: start };
      if (R.doing.test(n0)) { st.asked = 'purpose'; return { text: `Just hanging out on Alinor's site, waiting for questions 😄||What about you, what brings you here?`, chips: ["I'm a recruiter", 'Just looking around', 'Who is Alinor?'] }; }
      if (R.time.test(n0)) return { text: `It's **${new Date().toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: 'numeric', minute: '2-digit' })}** in the Philippines right now.`, chips: here };
      if (R.date.test(n0)) return { text: `It's **${new Date().toLocaleDateString('en-PH', { timeZone: 'Asia/Manila', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}** in the Philippines.`, chips: here };
      if (R.myname.test(n0)) { if (st.name) return { text: `You're **${st.name}**, right? 😄`, chips: here }; st.asked = 'name'; return { text: `You haven't told me yet! What should I call you?`, chips: start }; }
      if (R.myq.test(n0)) return { text: st.lastQ ? `You said: “${st.lastQ}”.` : `Nothing yet, this is your first message 😄`, chips: here };
      if (R.repeat.test(n0)) return { text: st.lastText ? `Sure 👇||${st.lastText}` : `I haven't said much yet 😄 Ask me something!`, chips: here };
      if (R.simpler.test(n0) && st.last) { const t = T[st.last]; st.offer = null; return { text: `Let me put it simply: ${(t.c || t.a).split('||')[0].split('\n')[0]}`, chips: here }; }
      if (R.low.test(n0)) { st.offer = { to: 'p-toll', q: '' }; return { text: /bored/.test(n0) ? `Let's fix that 😄 Want to hear about the RFID tollgate he built?` : `Aw, hang in there${hi} 🙏||Want a joke, or should I show you something cool he built?`, chips: ['Tell me a joke', 'Tell me about the tollgate'] }; }
    }

    const scores = scoreAll(n), top = scores[0] ? scores[0][0] : null;
    let topical = !!top && scores[0][1] >= 2;
    if (topical && st.last && PRON.test(n0) && GENERIC.has(top) && top !== st.last && scores[0][1] <= 3) topical = false;

    // answers to something I just asked
    if (asked === 'howru' && w <= 8 && !topical) {
      if (/\b(not (so )?(good|okay|great|fine|well)|bad|tired|sad|stressed|sick|pagod|kapoy|terrible|awful)\b/.test(n0)) { st.offer = { to: 'p-toll', q: '' }; return { text: `Aw, sorry to hear that. Hope it gets better 🙏||Want a joke, or should I show you something cool he built?`, chips: ['Tell me a joke', 'Tell me about the tollgate'] }; }
      if (/\b(good|fine|great|ok|okay|well|nice|mabuti|ayos|maayo|awesome|happy|not bad)\b/.test(n0)) { st.asked = 'purpose'; return { text: `Nice, glad to hear it${hi}! 😄||So what brings you here? Hiring, a school thing, or just looking around?`, chips: ["I'm a recruiter", 'Just looking around', 'Who is Alinor?'] }; }
    }
    if ((asked === 'purpose' && w <= 10) || /^(im )?just (looking|browsing|checking|visiting)/.test(n0)) {
      if (/\b(hir\w*|recruit\w*|job|employ\w*|hr|company)\b/.test(n0)) return recruiterReply(st, hi);
      if (/\b(school|student|class|classmate|assignment|research|thesis|teacher)\b/.test(n0)) { st.last = 'projects'; st.list = ['ai', 'iot']; return { text: `Oh nice! Then his **AI** and **IoT** projects are probably the most useful for you.||Which one first?`, chips: ['What AI projects has he made?', 'Show me his IoT projects'] }; }
      if (/\b(look\w*|brows\w*|visit\w*|check\w*|curious|nothing|wala|bored)\b/.test(n0)) { st.offer = { to: 'p-toll', q: '' }; return { text: `No pressure, look around 😄||Want to see one of the coolest things he's built?`, chips: ['Yes', 'Who is Alinor?', 'Show me his projects'] }; }
    }

    // exact items: "his number", "github link", "email?"
    const want = [];
    if (/\b(e ?mail|gmail)\b/.test(n0) && !/\b(project|app|reminder)/.test(n0)) want.push(`📧 ${EMAIL}`);
    if (/\b(phone|cell ?phone|mobile|contact|his|the) (number|numero)\b|^(number|numero)\b|\b(call|text|phone) him\b/.test(n0) && !/number of/.test(n0)) want.push(`📞 ${PHONE}`);
    if (/\bgit ?hub\b/.test(n0)) want.push(`• ${GITHUB}`);
    if (/\blinked ?in\b/.test(n0)) want.push(`• ${LINKEDIN}`);
    if (/\b(facebook|fb|messenger)\b/.test(n0)) want.push(`• ${FACEBOOK}`);
    if (/\b(socials?|social media|social profiles?)\b/.test(n0)) want.push(SOCIALS);
    if (want.length && w <= 12) {
      st.last = 'contact'; st.offer = null; st.given['contact:c'] = true;
      return { text: `${/\b(send|message|email|text|call) him\b.*\bfor me\b/.test(n0) ? `I can't do that for you, but here's how to reach him 👇` : pick(['Here you go 👇', 'Sure 👇', 'Got it 👇'])}||${want.join('\n')}`, chips: ['Can I see his resume?', 'Is he available for work?', 'Who is Alinor?'] };
    }

    if (R.give.test(n0)) return give(st);

    // "the first one", "number 2", "last one" → pick from the list I just gave
    const ord = n0.match(/^(?:the |number |no )?(first|1st|1|second|2nd|2|third|3rd|3|fourth|4th|4|last)(?: one| project)?(?: please| pls)?$/);
    if (ord && st.list) {
      const i = { first: 0, '1st': 0, 1: 0, second: 1, '2nd': 1, 2: 1, third: 2, '3rd': 2, 3: 2, fourth: 3, '4th': 3, 4: 3, last: st.list.length - 1 }[ord[1]];
      if (st.list[i]) return answerTopic(st, st.list[i], 'first', 'Good pick! ');
      return { text: `There are only ${st.list.length} on that list 😄 Which one?`, chips: here };
    }
    if (R.best.test(n0)) return answerTopic(st, 'p-toll', 'first', `If you only look at one, I'd say the tollgate. `);
    if (R.hireMe.test(n0)) {
      const fix = /\b(fix|repair|phone|laptop|pc|computer|technician)\b/.test(n0); st.last = 'contact'; st.offer = null;
      return { text: fix ? `Could be! He has **6+ years** of hardware repair experience.||Best to message him with the details: ${EMAIL} or ${PHONE}` : `He does take **freelance** web and IoT projects, so it's worth asking.||Message him what you need: ${EMAIL} or ${PHONE}`, chips: ['How can I contact him?', 'Show me his projects', 'What are his skills?'] };
    }
    if (R.recruiter.test(n0) && (!topical || top === 'avail' || top === 'who')) return recruiterReply(st, hi);

    if (!topical && R.howru.test(n0)) { st.asked = 'howru'; return { text: /kumusta|kamusta|musta/.test(n0) ? `Okay lang, salamat${hi}! 😊 Ikaw, kumusta?` : pick([`I'm good, thanks for asking${hi}! 😊 How about you?`, `Doing great${hi}! And you?`]), chips: start }; }
    if (!topical && R.meet.test(n0)) return { text: `Nice to meet you too${hi}! 😊`, chips: start };

    // follow-ups about whatever we were just talking about
    if (!topical && w <= 6) {
      if (R.doubt.test(n0)) {
        if (!st.last) return { text: `Yep, I stick to what's in his portfolio 👍||What do you want to know?`, chips: start };
        const t = T[st.last], nx = nextLevel(st, st.last); st.offer = nx ? { to: st.last, kind: 'more', q: '' } : null;
        if (st.kind === 'why' && /my read/i.test(t.why || '')) return { text: `Fair question. That part was my own read, not his words.||For the real reason, ask him: ${EMAIL}`, chips: here };
        return { text: `${pick(["Yeah, I'm sure 👍", 'Yep, pretty sure 👍'])} That's from his portfolio.||${nx ? `Want more on ${t.label}?` : `You can double-check with him too: ${EMAIL}`}`, chips: here };
      }
      const whyNot = st.offer && /^why not\b/.test(n0);
      if (R.more.test(n0)) return st.last ? answerTopic(st, st.last, 'more') : { text: `Sure! More about what: his **skills**, **projects** or **goals**?`, chips: start };
      if (R.why.test(n0) && !whyNot) return st.last ? answerTopic(st, st.last, 'why') : { text: `Why what? 🙂`, chips: ['What roles is he aiming for?', 'Who is Alinor?'] };
      if (R.how.test(n0)) return st.last ? answerTopic(st, st.last, /^how so\b/.test(n0) ? 'more' : 'how') : { text: `How what? 🙂 Pick a project and I'll explain it.`, chips: ['Tell me about the tollgate', 'Show me his projects'] };
      if (st.offer && (R.yes.test(n0) || R.okay.test(n0) || whyNot)) { const o = st.offer; st.offer = null; return answerTopic(st, o.to, o.kind || 'first'); }
      if (R.no.test(n0)) { st.offer = null; return { text: pick([`No problem${hi}! Anything else?`, `Okay, no worries 😊`]), chips: start }; }
      if (R.yes.test(n0)) { const nx = st.last && nextLevel(st, st.last); return nx ? answerTopic(st, st.last, 'more') : { text: `Great! What do you want to know${hi}?`, chips: start }; }
    }

    // small talk
    if (!topical && w <= 7) {
      if (R.greet.test(n0)) {
        const m = n0.match(/^(good|maayong|magandang) (\w+)/), opener = m ? `${cap(m[1])} ${m[2]}${hi}! 👋` : pick([`Hey${hi}! 👋`, `Hi${hi}! 👋`, `Hello${hi}! 👋`]);
        if (!st.met && !st.name) { st.met = true; st.asked = 'name'; return { text: `${opener} What's your name?`, chips: start }; }
        return { text: `${opener} What do you want to know about Alinor?`, chips: start };
      }
      if (R.thanks.test(n0)) return { text: /salamat/.test(n0) ? `Walang anuman${hi}! 😊` : pick([`You're welcome${hi}! 😊`, `Anytime${hi}! 😊`]), chips: ['Show me his projects', 'How can I contact him?', 'Is he available for work?'] };
      if (R.bye.test(n0)) { st.offer = null; return { text: `Bye${hi}, thanks for dropping by! 👋||If you ever want to reach him: ${EMAIL}`, chips: ['How can I contact him?'] }; }
      if (R.laugh.test(n0)) return { text: pick([`😄`, `Haha 😄 what else?`]), chips: here };
      if (R.joke.test(n0)) { st.offer = { to: 'net', q: '' }; return { text: `${['Why did the network engineer bring a ladder to work? To reach the **higher layers** of the OSI model 😄', 'Why do programmers prefer dark mode? Because light attracts **bugs** 😄', "There are 10 kinds of people: those who understand **binary** and those who don't 😄"][st.jokes++ % 3]}||Speaking of tech, want to hear about his networking work?`, chips: ['Yes', 'Another joke', 'Show me his projects'] }; }
      if (R.compliment.test(n0)) { st.offer = { to: 'projects', q: '' }; return { text: pick([`Thank you${hi}! 😊 Want to see what he's built?`, `Glad you like it${hi}! Want to see his projects?`]), chips: ['Show me his projects', 'Who is Alinor?'] }; }
      if (R.help.test(n0)) return { text: `Sure! I can tell you about his **skills**, **projects**, **DILG internship**, **goals**, or give you his **resume** and **contact**.||Just talk to me normally. I understand some Tagalog and Bisaya too.`, chips: start };
      if (R.ack.test(n0)) return { text: pick([`👍 Anything else?`, `Cool 😊 What else do you want to know?`]), chips: here };
    }

    // a real question about one (or two) topics
    if (topical) {
      const lead = R.greet.test(n0) ? `Hey${hi}! ` : LOCAL_TALK.test(n0) ? 'Sige! ' : '';
      const second = scores[1], both = second && second[1] >= 2 && second[1] >= scores[0][1] * .7 && (/\b(and|also|plus|or)\b/.test(n0) || /[,&]/.test(raw));
      if (both) {
        const x = T[top], y = T[second[0]];
        st.given[top + ':' + firstKind(x)] = st.given[second[0] + ':' + firstKind(y)] = true; st.last = second[0]; st.kind = 'c'; st.offer = null; if (y.list) st.list = y.list;
        return { text: `${lead}${x.c || x.a}||${y.c || y.a}`, chips: [...new Set([...(x.chips || []), ...(y.chips || [])])].slice(0, 3) };
      }
      const kind = /^(why|how come|bakit|ngano)\b/.test(n0) ? 'why' : /^(how (does|did|do|is|was)|paano|giunsa)\b/.test(n0) ? 'how' : R.more.test(n0) ? 'more' : 'first';
      return answerTopic(st, top, (kind === 'why' || kind === 'how') && !T[top][kind] ? 'first' : kind, lead);
    }
    if (st.last && PRON.test(n0)) return answerTopic(st, st.last, /\bhow\b/.test(n0) ? 'how' : /\bwhy\b/.test(n0) ? 'why' : 'more');
    if (scores.length) { const r = answerTopic(st, top, 'first'); r.text = `You mean ${T[top].label}?||` + r.text; return r; }

    // I didn't understand: ask, like a person would, instead of repeating one canned line
    st.offer = null; st.miss++;
    const echo = n0.split(' ').filter(x => !FILLER.has(x)).slice(0, 3).join(' ');
    if (st.miss >= 3) { st.miss = 0; return { text: `I think Alinor can answer that better than me 😅||${A('mailto:' + EMAIL + '?subject=Question%20from%20your%20portfolio', 'Email him here')} or try one of these:`, chips: start }; }
    if (st.miss === 2) return { miss: true, text: `Sorry${hi}, still not getting it 😅||Are you asking about his **work**, his **projects**, or how to **reach him**?`, chips: ['Tell me about his experience', 'Show me his projects', 'How can I contact him?'] };
    if (st.last && w <= 3) { const nx = nextLevel(st, st.last); st.offer = nx ? { to: st.last, kind: 'more', q: '' } : null; return { miss: true, text: `Sorry, didn't catch that 😅 Did you mean more about ${T[st.last].label}, or something else?`, chips: here }; }
    return { miss: true, text: `Hmm, ${echo ? `I don't know anything about “${echo}”` : `I'm not sure what you mean`}.||I mostly know his work side. Want to hear about his projects or skills?`, chips: start };
  }

  // one-shot answer (used by the preview box in the AI section)
  function localAnswer(q) { const s = newState(), p = respond(q, s).text.split('||'); if (s.offer && p.length > 1 && /\?$/.test(p[p.length - 1])) p.pop(); return p.join('\n\n'); }

  /* ======================= CHAT UI ======================= */
  const $ = s => document.querySelector(s);
  const panel = $('#aiPanel'), body = $('#aiBody'), input = $('#aiInput'), fab = $('#aiFab'), status = $('#aiStatus');
  const history = []; // {role, content} for the live AI
  const state = newState(), pending = [];
  let busy = false, greeted = false, liveOK = null;

  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // only plain links in this exact shape are kept as HTML; everything else is escaped
  const SAFE_LINK = /(<a href="(?:https?:\/\/|mailto:|tel:|resume\/|#)[^"<>]*"(?: target="_blank" rel="noopener")?>[^<]*<\/a>)/g;
  function render(text) {
    return text.split(SAFE_LINK).map((p, i) => i % 2 ? p : esc(p)
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<i>$2</i>')
      .replace(/([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g, '<a href="mailto:$1">$1</a>')
      .replace(/\+63 985 241 5204/g, '<a href="tel:+639852415204">$&</a>')).join('');
  }
  function add(role, html) { const m = document.createElement('div'); m.className = 'msg ' + role; m.innerHTML = html; body.appendChild(m); body.scrollTop = body.scrollHeight; return m; }
  const pause = ms => new Promise(r => setTimeout(r, ms));
  const dotsOn = () => add('bot typing', '<i></i><i></i><i></i>');
  function suggestions(list) {
    const box = $('#aiSugg'); box.innerHTML = '';
    list.slice(0, 3).forEach(q => { const b = document.createElement('button'); b.type = 'button'; b.textContent = q; b.onclick = () => ask(q); box.appendChild(b); });
  }

  async function liveAnswer() {
    if (liveOK === false) return null;
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 25000);
      const res = await fetch((window.BASE || '') + 'api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-9) }), signal: ctl.signal });
      clearTimeout(to);
      // 4xx (no /api/chat function, wrong method…) or 501 (no API key) → stop trying for this visit
      if (!res.ok) { if (res.status < 500 || res.status === 501) liveOK = false; return null; }
      const out = await res.json();
      if (out && typeof out.reply === 'string' && out.reply.trim()) { liveOK = true; return out.reply.trim(); }
      return null;
    } catch { liveOK = false; return null; }
  }

  // one message in → one or more short bubbles out, with a natural typing pause before each
  async function reply(q) {
    history.push({ role: 'user', content: q });
    let dots = dotsOn(), text = await liveAnswer(), chips = null;
    status.textContent = text ? 'online · live AI' : 'online';
    if (!text) { const r = respond(q, state); text = r.text; chips = r.chips; }
    const parts = text.split('||').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (!dots) dots = dotsOn();
      await pause(Math.min(1300, 380 + part.replace(/<[^>]+>/g, '').length * 7));
      dots.remove(); dots = null;
      add('bot', render(part));
    }
    history.push({ role: 'assistant', content: parts.join('\n\n').replace(/<[^>]+>/g, '') });
    if (!pending.length) suggestions((chips || DEFAULT_CHIPS).filter(s => s.toLowerCase() !== q.toLowerCase()));
  }
  // messages sent while it is still typing wait their turn instead of being lost
  async function ask(q) {
    q = (q || '').trim(); if (!q) return;
    open(); input.value = ''; add('me', esc(q)); pending.push(q);
    if (busy) return;
    busy = true;
    try { while (pending.length) await reply(pending.shift()); } finally { busy = false; }
  }

  function open() {
    panel.classList.add('open'); fab.classList.add('hidden');
    if (!greeted) { greeted = true; add('bot', render(`Hey! 👋 I'm **ALINOR.AI**, Alinor's AI assistant.`)); add('bot', render(`Ask me anything about him, or just say hi 😊`)); suggestions(DEFAULT_CHIPS); }
    setTimeout(() => input.focus({ preventScroll: true }), 300);
  }
  function close() { panel.classList.remove('open'); fab.classList.remove('hidden'); }

  document.addEventListener('click', e => { const b = e.target.closest('[data-open-ai]'); if (b) { e.preventDefault(); open(); } });
  body.addEventListener('click', e => { if (e.target.closest('a[href^="#"]')) close(); }); // jump links: get out of the way
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
