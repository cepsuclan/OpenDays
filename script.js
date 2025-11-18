let currentScene = "start";
let showExplanation = false;
let lastExplanation = "";
let goodChoices = 0;
let badChoices = 0;
let systemHealth = 3; // Multi-strike failure system: 3 mistakes allowed before the system fails
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
  systemHealth = 3;
}

// Function to Render Scene
function renderScene() {
  const scene = scenes[currentScene];

  if (!scene) {
    console.error("Error: Scene ID not found:", currentScene);
    sceneTextDiv.innerHTML = "Error: Scene missing — returning to start.";
    optionsDiv.innerHTML = '<button onclick="handleRestart()">Restart Game</button>';
    return;
  }

  sceneTextDiv.innerHTML = "";
  explanationDiv.innerHTML = "";
  optionsDiv.innerHTML = "";

  scoreBoxDiv.classList.remove("health-level-3", "health-level-2", "health-level-1", "health-level-0", "critical-pulse");

  if (systemHealth === 3) {
    scoreBoxDiv.classList.add("health-level-3");
  } else if (systemHealth === 2) {
    scoreBoxDiv.classList.add("health-level-2");
  } else if (systemHealth === 1) {
    scoreBoxDiv.classList.add("health-level-1");
  } else {
    scoreBoxDiv.classList.add("health-level-0");
  }

  if (systemHealth === 1) {
    scoreBoxDiv.classList.add("critical-pulse");
  } else {
    scoreBoxDiv.classList.remove("critical-pulse");
  }

  if (showExplanation && lastExplanation) {
    let warningMessage = "";
    if (systemHealth === 1) {
      warningMessage = "<br>CRITICAL WARNING: One more mistake will cause a system failure.";
    } else if (systemHealth <= 0) {
      warningMessage = "<br>!! SYSTEM FAILURE IMMINENT !!";
    }
    explanationDiv.innerHTML = `<div class="explanation">Result: ${lastExplanation}${warningMessage}</div>`;
  }

  typeWriterEffect(sceneTextDiv, scene.text, () => {
    renderOptions(scene.options);
  });

  addFadeInAnimation(sceneTextDiv);
  scoreBoxDiv.textContent = `Good Choices: ${goodChoices} | Bad Choices: ${badChoices} | Health: ${systemHealth}/3`;

  const isEndScene = currentScene === "win" || currentScene === "fail";
  if (restartButton) restartButton.style.display = isEndScene ? "block" : "none";
  uclanLinkContainer.style.display = isEndScene ? "block" : "none";
}


// Function to Render Options
function renderOptions(options) {
  randomizeOptions(options).forEach(option => {
    const button = document.createElement("button");
    button.textContent = option.text;

    if (option.handler === "handleRestart") {
      button.onclick = () => handleRestart();
    } else {
      button.onclick = () => handleOptionClick(option);
    }

    optionsDiv.appendChild(button);
  });
}


// Function to Handle Option Clicked
function handleOptionClick(option) {
  lastExplanation = option.explanation || "";
  showExplanation = true;

  if (option.isGood) {
    goodChoices++;
  } else {
    badChoices++;
    systemHealth--;
    if (systemHealth <= 0) {
      currentScene = "fail";
      return renderScene();
    }
    currentScene = scenes[option.next] ? option.next : "containment";
  }

  if (option.isGood) {
    currentScene = scenes[option.next] ? option.next : "win";
  }

  renderScene();
}

// UI helpers (Fade-in animation, Randomize options, Restart, Typewriter effect, Play beep sound)
function addFadeInAnimation(element) {
  element.classList.remove("fade-in");
  void element.offsetWidth;
  element.classList.add("fade-in");
}
function randomizeOptions(options) {
  return [...options].sort(() => Math.random() - 0.5);
}
function handleRestart() {
  currentScene = "start";
  showExplanation = false;
  lastExplanation = "";
  resetScores();
  explanationDiv.innerHTML = "";
  renderScene();
}
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
  }, 10);
}
function playBeepSound() {}

// Initialise
document.addEventListener("DOMContentLoaded", () => {
  resetScores();
  renderScene();
  if (restartButton) restartButton.addEventListener("click", handleRestart);
});
const scenes = {
  start: {
    text: ">> System starting up... There are problems! Our network is acting weird. Where is the best place to start looking for the issue?",
    options: [
      { text: ">> Check for strange emails (often the start of an attack)", next: "email", explanation: "Fake emails are a very common way for hackers to start. This is a smart place to look first.", isGood: true },
      { text: ">> Look at the main system's sign-in records", next: "server", explanation: "Checking who is trying to log in can show if someone is guessing passwords or using stolen accounts.", isGood: true },
      { text: ">> Check for strange data leaving our system over the internet", next: "networkTraffic", explanation: "Strange traffic might mean someone is secretly stealing our information or controlling an infected computer.", isGood: true },
      { text: ">> Look at the records for our online storage (the 'Cloud')", next: "cloud", explanation: "Many companies use online storage services. Mistakes in how they are set up can leave us open to attack.", isGood: true },
    ]
  },

  // === CLOUD AND IOT BRANCHES ===
  cloud: {
    text: ">> The records for our online storage show a temporary 'helper' account is taking financial files from a private online container and sending them from a country we don't usually use.",
    options: [
      { text: ">> Instantly turn off the 'helper' account and block where the data is going", next: "cloudContainment", explanation: "Stopping the compromised account right away is the fastest way to stop them from stealing more data.", isGood: true },
      { text: ">> Watch the data flow to see what they are taking before you stop it", next: "containment", explanation: "Delaying action lets the attacker continue their activity and steal more data. You must stop the leak first.", isGood: false },
      { text: ">> See if a small device, like a smart speaker, was hacked and used to get in", next: "iot", explanation: "Small devices (like smart appliances) can sometimes be hacked and used as a way to sneak into the network.", isGood: true }
    ]
  },

  cloudContainment: {
    text: ">> Access terminated. The investigation reveals that the secret code for the 'helper' account was accidentally posted online in a public folder.",
    options: [
      { text: ">> Check all our public folders to make sure no other secret codes were exposed", next: "internalScan", explanation: "We must ensure no other sensitive keys were accidentally exposed to prevent future attacks.", isGood: true },
      { text: ">> Set up an automatic tool that scans all code uploads for secret codes", next: "win", explanation: "A simple, automated check will prevent this mistake from ever happening again.", isGood: true }
    ]
  },

  iot: {
    text: ">> The scan shows a network-enabled coffee machine with old software is talking to the same strange location as the cloud login.",
    options: [
      { text: ">> Cut off the coffee machine from the network, update its software, and check its records", next: "ransom", explanation: "The machine was likely used as a stepping stone. Isolate it and fix it to stop its continued use.", isGood: true },
      { text: ">> Physically unplug the coffee machine right now", next: "containment", explanation: "Unplugging it is fast but destroys critical records (logs) we need to understand how the attacker got in.", isGood: false }
    ]
  },

  // === PHISHING/EMAIL BRANCH ===
  email: {
    text: ">> An email contains a link to a fake login page that looks exactly like ours.",
    options: [
      { text: ">> Move your mouse over the link to see the real address", next: "phishingInvestigation", explanation: "Verifying the link's real address prevents you from falling for a trick (phishing).", isGood: true },
      { text: ">> Report the email to the Security Team's spam mailbox", next: "server", explanation: "Reporting the email allows the IT team to block similar fake emails from reaching other employees.", isGood: true },
      { text: ">> Click the link to check if it's really our page", next: "containment", explanation: "Clicking unknown links risks immediate compromise. You took a serious risk!", isGood: false }
    ]
  },

  phishingInvestigation: {
    text: ">> The real link address shows a trick that takes advantage of a brand-new flaw in web browsers.",
    options: [
      { text: ">> This is a Brand-New Flaw ('Zero-Day'): Immediately deploy a major web browser security update.", next: "zerodayContainment", explanation: "A 'Zero-Day' is a flaw no one knew about. Rapid patching is needed before hackers use it more.", isGood: true },
      { text: ">> This is a Skilled Hacker Attack ('APT'): Now check for secret internal movements.", next: "apthack1", explanation: "Skilled hacker groups often use these brand-new flaws. It's smart to look for their next steps now.", isGood: true },
      { text: ">> This is an Old Flaw: Wait for the next normal software update.", next: "containment", explanation: "Assuming it's old and delaying the fix when facing an active threat leaves the company wide open.", isGood: false }
    ]
  },

  // === SERVER/AUTHENTICATION BRANCH ===
  server: {
    text: ">> The sign-in records show many failed logins on a special high-access account, all coming from a strange location. This is a possible password-guessing attack.",
    options: [
      { text: ">> Block the strange location and make the user change their password right now", next: "ddos", explanation: "This stops the ongoing attack and invalidates any password the attacker might have guessed.", isGood: true },
      { text: ">> Lock the high-access account immediately but don't block the location", next: "containment", explanation: "The attacker will just move on to guessing the next user's password. You must block their source first.", isGood: false },
      { text: ">> Check the online storage records for similar attempts", next: "cloud", explanation: "Attackers often try stolen or guessed passwords against multiple systems at the same time.", isGood: true }
    ]
  },

  // === NETWORK TRAFFIC BRANCH ===
  networkTraffic: {
    text: ">> Strange data is detected leaving the system. A huge amount of compressed (shrunken) files is being sent to a suspicious address.",
    options: [
      { text: ">> Block the address and redirect the traffic to a safe, controlled server", next: "trafficBlocked", explanation: "Immediate action stops the data theft and prevents the bad guys from re-using that secret address.", isGood: true },
      { text: ">> Analyze the data packets to find out what kind of files are being stolen", next: "containment", explanation: "Figuring out what was stolen is important, but stopping the secret transfer must be the top priority.", isGood: false },
      { text: ">> Start a scan inside the network to find the computer that is sending the data", next: "internalScan", explanation: "Finding the compromised computer is the next crucial step to remove the threat.", isGood: true }
    ]
  },

  trafficBlocked: {
    text: ">> Outbound data blocked. Alert: The infected computer immediately switched to using a known backup secret communication line.",
    options: [
      { text: ">> Cut off the infected computer from the entire network right away", next: "ransom", explanation: "Isolation is the most effective way to stop the secret communication line and prevent the attack from spreading.", isGood: true },
      { text: ">> Keep blocking the new secret communication address one by one", next: "containment", explanation: "The bad guys are likely using an automatic system to switch addresses. You will lose this race.", isGood: false }
    ]
  },

  // === INTERNAL SCAN AND CONTAINMENT ===
  internalScan: {
    text: ">> The internal scan reveals an unauthorized file on an employee computer, hiding inside a normal-looking system folder. This file is secretly recording everything the user types.",
    options: [
      { text: ">> Take a perfect, frozen copy of the computer's hard drive for analysis", next: "aptscan", explanation: "This 'digital snapshot' preserves all evidence, letting us find the passwords they stole and how they got in.", isGood: true },
      { text: ">> Immediately delete the file and clean the machine", next: "containment", explanation: "Deleting the file destroys the evidence needed to understand *how* it got there and prevent future attacks.", isGood: false }
    ]
  },

  containment: {
    text: ">> System Health Warning. The action you took was not the best choice. A quick fix is necessary to prevent the entire system from failing.",
    options: [
      { text: ">> Use the full 'Emergency Stop' containment plan", next: "zerodayContainment", explanation: "This plan limits the damage quickly and buys time for the security team to figure out a better solution.", isGood: true },
      { text: ">> Hope the issue resolves itself", next: "fail", explanation: "Hoping for the best is not a security strategy. The system is now critically compromised.", isGood: false }
    ]
  },


  // === SKILLED HACKER ATTACK (APT) BRANCH ===
  aptscan: {
    text: ">> The analysis suggests a highly skilled, organized hacker group is involved. They are using custom bad software that avoids our normal scanners.",
    options: [
      { text: ">> Escalate the incident to the specialized team for deep memory checks", next: "aptscan2", explanation: "These skilled hacker groups need specialized techniques to find their hidden tools and backdoors.", isGood: true },
      { text: ">> Run a simple virus scan again, but in 'deep mode'", next: "containment", explanation: "The custom bad software is designed to avoid simple scans, even deep ones.", isGood: false }
    ]
  },

  aptscan2: {
    text: ">> The specialized team confirms the hacker group is secretly moving from one computer to another, looking for the main control server.",
    options: [
      { text: ">> Deploy new rules to cut off the main control server from all employee computers", next: "aptscan3", explanation: "Preventing access to the main control server stops the hacker from taking over the entire network.", isGood: true },
      { text: ">> Make all employees change their password right now", next: "containment", explanation: "Changing passwords is useless if the attacker is already inside the main control server or can steal the new passwords right away.", isGood: false }
    ]
  },

  aptscan3: {
    text: ">> The secret movement is blocked. The attacker is now trapped on a few separated machines. Time to finish the cleanup.",
    options: [
      { text: ">> Completely erase and rebuild all compromised machines from clean backups", next: "postIncidentActivities", explanation: "The only sure way to remove sophisticated hackers is a clean wipe and restore. Simple cleaning will miss hidden tools.", isGood: true },
      { text: ">> Only remove the bad software and restart the machines", next: "containment", explanation: "Skilled hacker groups leave hidden ways to get back in. A simple removal will lead to immediate re-infection.", isGood: false }
    ]
  },


  // === DDoS / RANSOMWARE BRANCH ===
  ddos: {
    text: ">> Location blocked. New alert: a massive flood of junk requests is hitting our system (DDoS).",
    options: [
      { text: ">> Contact the internet provider for help and use our cloud protection services", next: "mitigated", explanation: "Blocking the junk traffic before it reaches our building (at the internet provider level) is the only way to stop it.", isGood: true },
      { text: ">> Increase the server's power to handle all the extra traffic", next: "containment", explanation: "No server is big enough for a massive flood attack. This is an expensive and temporary solution.", isGood: false }
    ]
  },

  mitigated: {
    text: ">> The traffic flood is stopped. New issue: ransomware on a critical database server. All data is locked with a password.",
    options: [
      { text: ">> Cut off the affected server and check if our backups are ready", next: "ransom", explanation: "Immediate isolation prevents the lock-down from spreading. Backups are the only reliable way to get the data back.", isGood: true },
      { text: ">> Try to guess the lock's password to get the data back", next: "containment", explanation: "Modern ransomware uses military-grade locks. Trying to guess the password is a waste of time we need for recovery.", isGood: false }
    ]
  },

  ransom: {
    text: ">> Server is cut off. Backups are clean and working. What is the next step?",
    options: [
      { text: ">> Restore data from backup, fix the security hole they used, and check the logs for how they got in.", next: "postIncidentActivities", explanation: "The full plan: recover the data, fix the flaw, and learn from the system records.", isGood: true },
      { text: ">> Just erase and rebuild the server without checking the security hole", next: "containment", explanation: "Rebuilding the server without fixing the security hole leaves the door wide open for them to do it again right away.", isGood: false }
    ]
  },

  // === BRAND NEW FLAW (ZERO DAY) / REMEDIATION BRANCH ===
  zerodayContainment: {
    text: ">> A temporary fix is active, and the flaw has been reported. The immediate danger is gone.",
    options: [
      { text: ">> Start a check of all systems to find any remaining weaknesses", next: "internalScan", explanation: "It's smart to check for other weaknesses while the security team is on high alert.", isGood: true },
      { text: ">> Finish the incident and start the wrap-up process", next: "postIncidentActivities", explanation: "The main threat is handled, but the official wrap-up is still necessary.", isGood: true }
    ]
  },

  // === CLOSURE / FINAL STAGES ===
  postIncidentActivities: {
    text: ">> All systems recovered. Time for a final review and making things stronger.",
    options: [
      { text: ">> Conduct a formal review of what happened (lessons learned)", next: "postIncidentReview", explanation: "A formal review helps us learn from the attack and be faster next time.", isGood: true },
      { text: ">> Tell all necessary people (like management and legal) what happened", next: "stakeholderNotification", explanation: "Ensures we follow all necessary rules and keep everyone informed.", isGood: true }
    ]
  },

  postIncidentReview: {
    text: ">> The review finds that employee training was weak, and people had too much access to things they didn't need.",
    options: [
      { text: ">> Set up stronger log-in checks and give people only the minimum access they need", next: "emailFiltering", explanation: "Limiting access dramatically reduces how much damage an attacker can do once they get inside.", isGood: true },
      { text: ">> Schedule company-wide cybersecurity awareness training", next: "awarenessTraining", explanation: "Employees are the first line of defense; ongoing training is critical for keeping everyone alert.", isGood: true }
    ]
  },

  awarenessTraining: {
    text: ">> Cybersecurity awareness training completed. Employees are now much more careful.",
    options: [
      { text: ">> Finish the Incident Response", next: "win", explanation: "Training is crucial for long-term security.", isGood: true }
    ]
  },

  emailFiltering: {
    text: ">> Stricter limits and minimum access rules reduce the chance of attack dramatically.",
    options: [
      { text: ">> Finish the Incident Response", next: "win", explanation: "Excellent — the risk of future attacks is significantly reduced.", isGood: true }
    ]
  },

  stakeholderNotification: {
    text: ">> All important people have been told, and all rules have been followed.",
    options: [
      { text: ">> Finish the Incident Response", next: "win", explanation: "Proper communication completed.", isGood: true }
    ]
  },

  // --- Win /Fail Scenes---
  win: {
    text: ">> SUCCESS! The attack is stopped. All systems are clean, security holes are fixed, and new protections are active. EXCELLENT WORK!",
    options: [
      { text: ">> Restart Simulation", handler: "handleRestart" }
    ]
  },
  fail: {
    text: ">> SYSTEM HAS BEEN DESTROYED. Because of multiple big mistakes, the attacker has taken full control. Data is stolen and locked forever. Your company has suffered a catastrophic loss.",
    options: [
      { text: ">> Restart Simulation", handler: "handleRestart" }
    ]
  }
};