// Global Variables
let currentScene = "start";
let showExplanation = false;
let lastExplanation = "";
let goodChoices = 0;
let badChoices = 0;

// Cache DOM Elements
const sceneTextDiv = document.getElementById("scene-text");
const explanationDiv = document.getElementById("explanation");
const optionsDiv = document.getElementById("options");
const scoreBoxDiv = document.getElementById("score-box");
const restartButton = document.getElementById("restart-button");
const uclanLinkContainer = document.getElementById("uclan-link-container");

// Function to Reset Scores
function resetScores() {
  goodChoices = 0;
  badChoices = 0;
  console.log("Scores reset:", goodChoices, badChoices);
}

// Function to Render Scene
function renderScene() {
  const scene = scenes[currentScene];

  // Reset Content
  sceneTextDiv.innerHTML = "";
  explanationDiv.innerHTML = "";
  optionsDiv.innerHTML = "";

  // Add Explanation if Applicable
  if (showExplanation && lastExplanation) {
    explanationDiv.innerHTML = `<div class="explanation">Result: ${lastExplanation}</div>`;
  }

  // Render Scene Text with Typewriter Effect
  if (currentScene === "start") {
    resetScores();
    typeWriterEffect(sceneTextDiv, scene.text, () => {
      renderOptions(scene.options);
      uclanLinkContainer.style.display = "block";
    });
  } else {
    typeWriterEffect(sceneTextDiv, scene.text, () => {
      renderOptions(scene.options);
    });
  }

  // Add Fade-in Animation
  addFadeInAnimation(sceneTextDiv);

  // Update Score Display
  scoreBoxDiv.textContent = `Good Choices: ${goodChoices} | Bad Choices: ${badChoices}`;

  // Show/Hide Restart Button
  restartButton.style.display = currentScene !== "start" ? "block" : "none";

  // Show/Hide UCLan Link Container
  const isEndScene = currentScene === "win" || currentScene === "fail";
  uclanLinkContainer.style.display = isEndScene ? "block" : "none";
}

// Function to Render Options
function renderOptions(options) {
  randomizeOptions(options).forEach(option => {
    const button = document.createElement("button");
    button.textContent = option.text;
    button.onclick = () => handleOptionClick(option);
    optionsDiv.appendChild(button);
  });
}

// Function to Handle Option Click
function handleOptionClick(option) {
  lastExplanation = option.explanation || "";
  showExplanation = true;

  if (option.isGood) {
    goodChoices++;
  } else {
    badChoices++;
    playBeepSound(); // Play beep sound for incorrect answers
  }

  currentScene = option.next;
  renderScene();
}

// Function to Add Fade-in Animation
function addFadeInAnimation(element) {
  element.classList.remove("fade-in");
  void element.offsetWidth; // Trigger reflow
  element.classList.add("fade-in");
}

// Function to Randomize Options
function randomizeOptions(options) {
  return [...options].sort(() => Math.random() - 0.5);
}

// Function to Handle Restart
function handleRestart() {
  currentScene = "start";
  showExplanation = false;
  lastExplanation = "";
  resetScores();

  // Clear Explanation Text
  explanationDiv.innerHTML = "";

  renderScene();
}

// Typewriter Effect
function typeWriterEffect(element, text, callback) {
  let i = 0;
  element.innerHTML = "";
  const intervalId = setInterval(() => {
    element.innerHTML += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(intervalId);
      if (callback) callback();
    }
  }, 20); // Faster typewriter effect
}

// Play Beep Sound
function playBeepSound() {
  const audio = new Audio('beep.mp3'); // Add a beep.mp3 file in your project directory
  audio.play();
}

// Event Listener for Restart Button
document.addEventListener("DOMContentLoaded", () => {
  renderScene();
  restartButton.addEventListener("click", handleRestart);
});

const scenes = {
  start: {
    text: ">> Booting system...\n>> Incoming alerts...\n\nYou're a junior cybersecurity analyst working at YuClan Computing. The network is acting strangely. What do you do?",
    options: [
      { text: ">> Check suspicious emails", next: "email", explanation: "Good choice — phishing emails are one of the most common ways attackers gain initial access.", isGood: true },
      { text: ">> Investigate server logs", next: "server", explanation: "Smart move — server logs provide insight into unauthorized access.", isGood: true },
      { text: ">> Scan for anomalous traffic", next: "networkTraffic", explanation: "This helps detect signs of data exfiltration or malware communication.", isGood: true }
    ]
  },
  apthack1: {
    text: ">> Multiple employees report strange email attachments from known but slightly altered email addresses.\n>> This could be the first phase of a potential APT. What do you do?",
    options: [
      { text: ">> Initiate a company-wide email scan for attachments.", next: "aptscan", explanation: "Good choice — APTs often begin with targeted email campaigns to gain initial access. Scanning for malicious attachments early can prevent further exploitation by catching these threats before they spread.", isGood: true },
      { text: ">> Ignore, it could be a false alarm.", next: "fail", explanation: "Incorrect — ignoring these early warning signs could allow the attack to escalate. APTs are stealthy, and the attacker might exploit vulnerabilities for months without detection.", isGood: false }
    ]
  },
  email: {
    text: ">> Email contains a link to an external login page. What's your move?",
    options: [
      { text: ">> Hover over the link to inspect the URL", next: "phishingInvestigation", explanation: "Correct — before clicking, always hover over links to inspect their actual destination. Phishing emails often disguise malicious URLs with slight alterations of legitimate domain names. This helps you avoid being tricked into visiting a fake site.", isGood: true },
      { text: ">> Click the link", next: "fail", explanation: "Incorrect — clicking the link could lead to a phishing site that steals your credentials or installs malware on your system. Always verify links before interacting with them.", isGood: false },
      { text: ">> Report to phishing mailbox", next: "server", explanation: "Smart move — reporting the phishing email to your IT or security team can help them block similar attacks and prevent future damage. Many organizations have a designated phishing report mailbox to centralize and address these threats.", isGood: true }
    ]
  },
  aptscan2: {
    text: ">> A deeper investigation shows unusual traffic between your internal servers and an external IP address.\n>> This could be the attacker moving laterally. What do you do?",
    options: [
      { text: ">> Lock down lateral movement and initiate a scan for unauthorized devices.", next: "aptscan3", explanation: "Correct — APT attackers often move laterally within a network to escalate privileges. Locking down lateral movement limits their ability to access other critical systems. Scanning for unauthorized devices helps spot any devices that shouldn't be there.", isGood: true },
      { text: ">> Wait for more evidence before taking action.", next: "fail", explanation: "Incorrect — APTs rely on stealth. Waiting for more evidence could allow the attacker to gain more control of the network and go undetected for longer.", isGood: false }
    ]
  },
  hover: {
    text: ">> URL looks suspicious. You decide to report it.\n\nIncident logged. What now?",
    options: [
      { text: ">> Investigate server logs", next: "server", explanation: "Good follow-up — checking logs can uncover other signs of compromise.", isGood: true },
      { text: ">> Warn staff about phishing", next: "warnedStaff", explanation: "Strong leadership — educating users can prevent future incidents.", isGood: true }
    ]
  },
  phishingInvestigation: {
    text: ">> The URL inspection reveals a suspicious domain. You suspect a phishing attempt. What do you do next?",
    options: [
      {
        text: ">> Report the phishing attempt to the security team",
        next: "phishingEscalation",
        explanation: "Good choice — reporting phishing attempts helps the team take action to block the domain and warn others.",
        isGood: true
      },
      {
        text: ">> Block the domain in the firewall",
        next: "firewallBlock",
        explanation: "Correct — blocking the domain prevents others from accessing it.",
        isGood: true
      },
      {
        text: ">> Ignore it — it might not be a real threat",
        next: "fail",
        explanation: "Incorrect — ignoring phishing attempts can lead to compromised accounts.",
        isGood: false
      }
    ]
  },
  firewallBlock: {
    text: ">> The domain is blocked in the firewall. However, similar phishing emails are still being received. What do you do next?",
    options: [
      {
        text: ">> Investigate the email headers for more details",
        next: "emailHeaderAnalysis",
        explanation: "Good choice — analyzing email headers can reveal the source of the phishing campaign.",
        isGood: true
      },
      {
        text: ">> Notify employees to avoid suspicious emails",
        next: "awarenessTraining",
        explanation: "Correct — notifying employees helps prevent them from falling for phishing attempts.",
        isGood: true
      },
      {
        text: ">> Ignore the issue",
        next: "fail",
        explanation: "Incorrect — ignoring phishing attempts can lead to compromised accounts.",
        isGood: false
      }
    ]
  },
  emailHeaderAnalysis: {
    text: ">> The email headers reveal the phishing emails are being sent from a compromised third-party account. What do you do?",
    options: [
      {
        text: ">> Notify the third party about the compromise",
        next: "thirdPartyNotification",
        explanation: "Good choice — notifying the third party helps them secure their account and stop the phishing campaign.",
        isGood: true
      },
      {
        text: ">> Block all emails from the third party",
        next: "fail",
        explanation: "Incorrect — blocking all emails may disrupt legitimate communication.",
        isGood: false
      },
      {
        text: ">> Conduct a deeper investigation into the phishing campaign",
        next: "phishingCampaignInvestigation",
        explanation: "Correct — a deeper investigation can uncover the full scope of the attack.",
        isGood: true
      }
    ]
  },
  thirdPartyNotification: {
    text: ">> The third party secures their account and stops the phishing campaign. Your proactive action prevented further incidents. What do you do next?",
    options: [
      {
        text: ">> Conduct a post-incident review",
        next: "postIncidentReview",
        explanation: "Good — reviewing the incident helps improve future response strategies.",
        isGood: true
      },
      {
        text: ">> Return to monitoring",
        next: "emailMonitoring",
        explanation: "Correct — ongoing monitoring ensures continued protection.",
        isGood: true
      }
    ]
  },
  phishingEscalation: {
    text: ">> The security team confirms the phishing attempt and blocks the domain. They also discover similar phishing emails targeting other employees. What do you do?",
    options: [
      {
        text: ">> Conduct a company-wide phishing awareness training",
        next: "awarenessTraining",
        explanation: "Great choice — educating employees reduces the risk of future phishing attacks.",
        isGood: true
      },
      {
        text: ">> Monitor email traffic for similar patterns",
        next: "emailMonitoring",
        explanation: "Good — monitoring helps detect and prevent further phishing attempts.",
        isGood: true
      },
      {
        text: ">> Take no further action",
        next: "fail",
        explanation: "Incorrect — phishing campaigns often target multiple users. Proactive measures are necessary.",
        isGood: false
      }
    ]
  },
  insiderinvestigate: {
    text: ">> An employee's credentials were used to access sensitive files. What do you do?",
    options: [
      { text: ">> Lock the employee's account and investigate.", next: "insiderSabotage", explanation: "Correct — insider threats are difficult to detect, and the first step is to prevent further damage by locking the account. Investigating the incident helps determine if the employee is involved in sabotage or if their credentials were compromised.", isGood: true },
      { text: ">> Let them finish the task, it might be a misunderstanding.", next: "fail", explanation: "Incorrect — waiting allows the insider to cause more harm. When dealing with potential insider threats, immediate action is essential to prevent escalation.", isGood: false }
    ]
  },
  insiderSabotage: {
    text: ">> Logs show the employee modified critical server configurations, causing system crashes.\n>> What do you do next?",
    options: [
      { text: ">> Isolate the affected servers and change all access credentials.", next: "win", explanation: "Great move — isolating the affected servers prevents further damage. Changing credentials ensures that the insider cannot use their access to sabotage the systems further. This helps prevent additional compromises.", isGood: true },
      { text: ">> Ignore the issue, the employee might be authorized to do so.", next: "fail", explanation: "Incorrect — insiders with access privileges can cause significant harm. Ignoring the problem allows them to continue their actions and potentially lead to greater system damage.", isGood: false }
    ]
  },
  zerodayexploit: {
    text: ">> After a software update, an employee reports strange behavior. You suspect a zero-day exploit.\n>> What do you do?",
    options: [
      { text: ">> Report the exploit to the vendor and apply a temporary workaround.", next: "zerodayContainment", explanation: "Good — zero-day exploits take advantage of vulnerabilities that are unknown to the vendor. Reporting it helps the vendor create a fix, and a temporary workaround can minimize the damage until the patch is available.", isGood: true },
      { text: ">> Ignore it, it might not be affecting your network.", next: "fail", explanation: "Incorrect — zero-day exploits are particularly dangerous because they’re not yet patched. Ignoring them can allow attackers to gain control of the system and cause significant damage.", isGood: false }
    ]
  },
  warnedStaff: {
    text: ">> Staff warned. Some phishing attempts avoided. Good comms.",
    options: [
      { text: ">> Continue monitoring", next: "server", explanation: "Ongoing monitoring is essential in any response workflow.", isGood: true }
    ]
  },
  awarenessTraining: {
    text: ">> Employees are trained to recognize phishing attempts. Reports of suspicious emails increase, helping the security team respond faster. What do you do next?",
    options: [
      {
        text: ">> Continue monitoring for phishing attempts",
        next: "emailMonitoring",
        explanation: "Good — ongoing monitoring is essential to prevent future attacks.",
        isGood: true
      },
      {
        text: ">> Focus on other security priorities",
        next: "networkTraffic",
        explanation: "Correct — balancing priorities ensures comprehensive security coverage.",
        isGood: true
      }
    ]
  },
  server: {
    text: ">> Multiple failed logins from a foreign IP. Potential brute-force attack.",
    options: [
      { text: ">> Block IP and rotate passwords", next: "ddos", explanation: "Correct — blocks the source and limits access with fresh credentials.", isGood: true },
      { text: ">> Run vulnerability scanner", next: "fail", explanation: "Incorrect — scanning during an active attack can be disruptive and doesn’t stop it.", isGood: false },
      { text: ">> Ignore (trust the firewall)", next: "fail", explanation: "Incorrect — passive defense isn't enough for targeted attacks.", isGood: false }
    ]
  },
  ddos: {
    text: ">> IP blocked. New issue: major spike in traffic — potential DDoS detected.",
    options: [
      { text: ">> Contact ISP to initiate filtering", next: "mitigated", explanation: "Correct — ISPs can help block traffic upstream before it hits your servers.", isGood: true },
      { text: ">> Restart server", next: "fail", explanation: "Incorrect — won’t stop the DDoS and could worsen service disruptions.", isGood: false },
      { text: ">> Deploy rate-limiting rules", next: "fail", explanation: "Not effective at this scale — upstream filtering is required for volume-based attacks.", isGood: false }
    ]
  },
  mitigated: {
    text: ">> DDoS mitigated. Another alert: ransomware detected on workstation-22.",
    options: [
      { text: ">> Isolate affected system", next: "ransom", explanation: "Correct — immediate isolation prevents ransomware from spreading laterally.", isGood: true },
      { text: ">> Attempt to decrypt files", next: "fail", explanation: "Incorrect — not all ransomware is decryptable, and this wastes critical time.", isGood: false },
      { text: ">> Pay the ransom", next: "fail", explanation: "Not recommended — there's no guarantee of recovery and it encourages attackers.", isGood: false }
    ]
  },
  ransom: {
    text: ">> Workstation isolated. Backups are available.\n\nWhat do you do next?",
    options: [
      {
        text: ">> Restore from backup and patch vulnerability",
        next: "postIncidentActivities",
        explanation: "Correct — clean recovery and hardening prevents recurrence.",
        isGood: true
      },
      {
        text: ">> Format and redeploy",
        next: "postIncidentActivities",
        explanation: "Also valid — starting from scratch ensures nothing malicious is left behind.",
        isGood: true
      }
    ]
  },
  networkTraffic: {
    text: ">> Traffic scan shows irregular outbound connections to unknown IPs. It may be a beaconing malware.",
    options: [
      { text: ">> Trace the connections and block suspicious IPs", next: "traceSuccess", explanation: "Correct — this can disrupt communication with attacker-controlled servers.", isGood: true },
      { text: ">> Reboot the router", next: "fail", explanation: "Incorrect — won’t stop the malware and may remove useful evidence.", isGood: false },
      { text: ">> Ignore (could be false positive)", next: "fail", explanation: "Incorrect — ignoring could allow data to be exfiltrated undetected.", isGood: false }
    ]
  },
  traceSuccess: {
    text: ">> You traced the connections and blocked the C2 IP addresses. Malware disrupted.",
    options: [
      { text: ">> Isolate potentially compromised machines", next: "ransom", explanation: "Correct — this prevents further spread and allows deeper forensics.", isGood: true },
      { text: ">> Notify SOC team", next: "win", explanation: "Good escalation — proper notification allows the team to initiate wider response actions.", isGood: true }
    ]
  },
  insiderThreat: {
    text: ">> An employee seems to be accessing files they don't normally interact with. What do you do?",
    options: [
      { text: ">> Investigate the employee's access logs", next: "investigateEmployee", explanation: "Correct — reviewing logs can confirm unauthorized access and gather evidence.", isGood: true },
      { text: ">> Ignore it — they'll likely stop", next: "fail", explanation: "Incorrect — ignoring suspicious activity can lead to serious data loss or sabotage.", isGood: false },
      { text: ">> Report to HR and initiate investigation", next: "investigateEmployee", explanation: "Good — HR and IT need to collaborate to protect the company from internal threats.", isGood: true }
    ]
  },
  shadowIT: {
    text: ">> You've detected unauthorized software communicating with an unknown external domain.\n>> What do you do?",
    options: [
      {
        text: ">> Conduct memory analysis on the host",
        next: "memoryAnalysis",
        explanation: "Good — memory forensics can reveal injected code, malware behavior, and persistence methods.",
        isGood: true
      },
      {
        text: ">> Uninstall the application and delete logs",
        next: "fail",
        explanation: "Incorrect — deleting logs destroys evidence. Always preserve data before remediation.",
        isGood: false
      },
      {
        text: ">> Block domain and reboot",
        next: "fail",
        explanation: "Blocking helps, but without investigation, the root cause remains unknown.",
        isGood: false
      }
    ]
  },
  memoryAnalysis: {
    text: ">> Memory dump reveals a process injecting shellcode. You suspect remote access malware.",
    options: [
      {
        text: ">> Isolate the host and perform a full forensic acquisition",
        next: "win",
        explanation: "Excellent — isolating the system and preserving full disk & memory images supports future analysis and evidence.",
        isGood: true
      },
      {
        text: ">> Run antivirus and close open connections",
        next: "fail",
        explanation: "Insufficient — malware may persist or leave backdoors. You need full forensic containment.",
        isGood: false
      }
    ]
  },
  credentialStuffing: {
    text: ">> Multiple login attempts on customer accounts detected from diverse IPs.\n>> Login success rates suggest credential stuffing.",
    options: [
      {
        text: ">> Force password resets for affected accounts and enable CAPTCHA",
        next: "win",
        explanation: "Correct — both steps help mitigate ongoing attacks and harden login endpoints.",
        isGood: true
      },
      {
        text: ">> Block all traffic from foreign countries",
        next: "fail",
        explanation: "Overly aggressive — this may impact legitimate users and doesn't stop the core attack.",
        isGood: false
      },
      {
        text: ">> Ignore — users can change passwords themselves",
        next: "fail",
        explanation: "Dangerous — credential stuffing can cause massive unauthorized access if not stopped quickly.",
        isGood: false
      }
    ]
  },
  investigateEmployee: {
    text: ">> Upon reviewing logs, you discover the employee accessed sensitive data. What now?",
    options: [
      { text: ">> Lock their account and audit their actions", next: "ransom", explanation: "Correct — locking accounts prevents further damage and auditing helps determine the full scope of the incident.", isGood: true },
      { text: ">> Let them finish the task — it might be a misunderstanding", next: "fail", explanation: "Incorrect — allowing further access could lead to catastrophic data loss or breach.", isGood: false }
    ]
  },
  misconfiguredCloudBucket: {
    text: ">> A misconfigured S3 bucket is found — public access to sensitive documents. What do you do?",
    options: [
      { text: ">> Immediately restrict public access and review IAM permissions", next: "cloudFixed", explanation: "Correct — blocking public access and tightening IAM permissions prevents unauthorized exposure.", isGood: true },
      { text: ">> Ignore it — only a few files are public", next: "fail", explanation: "Incorrect — sensitive data exposure can have serious implications, even with limited access.", isGood: false },
      { text: ">> Share the link to colleagues", next: "fail", explanation: "Incorrect — publicly sharing the link can exacerbate the security risk.", isGood: false }
    ]
  },
  cloudFixed: {
    text: ">> The cloud bucket has been secured. What now?",
    options: [
      { text: ">> Notify legal team about potential data breach", next: "win", explanation: "Correct — informing legal helps prepare for possible regulatory or compliance consequences.", isGood: true },
      { text: ">> Monitor access logs and perform a full audit", next: "win", explanation: "Great — continual monitoring and auditing helps detect any remaining vulnerabilities.", isGood: true }
    ]
  },
  postIncidentReview: {
    text: ">> The post-incident review identifies gaps in email filtering and employee training. What do you do?",
    options: [
      {
        text: ">> Implement stricter email filtering rules",
        next: "emailFiltering",
        explanation: "Good — stricter filtering reduces the risk of phishing emails reaching employees.",
        isGood: true
      },
      {
        text: ">> Schedule additional employee training",
        next: "awarenessTraining",
        explanation: "Correct — ongoing training ensures employees stay vigilant.",
        isGood: true
      }
    ]
  },
  postIncidentActivities: {
    text: ">> The ransomware incident has been resolved. It's time to focus on post-incident activities to strengthen your organization's security posture. What do you do next?",
    options: [
      {
        text: ">> Conduct a post-incident review to identify gaps in the response process",
        next: "postIncidentReview",
        explanation: "Good choice — reviewing the incident helps identify weaknesses and improve future responses.",
        isGood: true
      },
      {
        text: ">> Notify stakeholders and regulatory bodies about the incident",
        next: "stakeholderNotification",
        explanation: "Correct — transparency with stakeholders and compliance with regulations are critical after an incident.",
        isGood: true
      },
      {
        text: ">> Assume the issue is resolved and return to normal operations",
        next: "fail",
        explanation: "Incorrect — failing to address post-incident activities leaves your organization vulnerable to future attacks.",
        isGood: false
      }
    ]
  },
  win: {
    text: ">> INCIDENT RESPONSE COMPLETE\n>> Your actions stopped the breach and restored services. Nice work, analyst.",
    options: [
      { text: ">> Restart", next: "start", explanation: "Restart the simulation from the beginning to try other paths." }
    ]
  },
  fail: {
    text: ">> SYSTEM COMPROMISED\n>> The wrong action led to data loss or further intrusion.\n\nTry again?",
    options: [
      { text: ">> Restart", next: "start", explanation: "Restart the simulation and make better security decisions next time." }
    ]
  }
};
