export const exampleModules = [
    {
        module_id: "conflict_resolution",
        moduleWeight: {
            compliance: 0.2,
            process: 0.2,
            communication: 0.2,
            efficiency: 0.2,
            outcome: 0.2,
        },
        moodThreshold: {
            angry: [0, 40],
            frustrated: [40, 75],
            calm: [75, null],
        },
        title: "Conflict Resolution",
        description:
            "Learn how to respond when a customer is upset or frustrated.",
        lessons: ["double_billing"],
    },
    {
        module_id: "billing_basics",
        title: "Billing and Payments",
        description:
            "Explain charges, payment options, and refund timelines clearly.",
        lessons: ["unexpected_fee", "missing_payment", "refund_status"],
    },
    {
        module_id: "account_security",
        title: "Account Security and Identity Verification",
        description:
            "Protect customer information while helping callers regain access to their accounts.",
        lessons: [
            "password_reset",
            "locked_account",
            "unrecognized_login",
            "third_party_access",
        ],
    },
    {
        module_id: "technical_support",
        title: "Technical Support",
        description:
            "Guide customers through practical troubleshooting, one step at a time.",
        lessons: [
            "no_connection",
            "slow_connection",
            "app_crash",
            "device_setup",
            "service_outage",
            "repeat_issue",
        ],
    },
    {
        module_id: "customer_communication",
        title: "Clear Communication During Difficult Customer Conversations",
        description:
            "Practice listening, explaining next steps, and setting expectations when customers are confused, in a hurry, or need extra support.",
        lessons: ["explain_terms", "long_wait", "accessibility_support"],
    },
    {
        module_id: "service_changes",
        title: "Service Changes",
        description:
            "Help customers choose, change, or cancel services with confidence.",
        lessons: ["change_plan", "cancel_service"],
    },
];

// Each scenario has its own request and next step, with a shared three-stage
// conversation shape matching the original lesson below.
const additionalScenarios = [
    [
        "unexpected_fee",
        "Understanding an Unexpected Fee",
        "There is a fee on my bill that I do not understand.",
        "Let's review the charge and the terms on your account together.",
    ],
    [
        "missing_payment",
        "Tracking a Missing Payment",
        "I paid yesterday, but my account still shows an unpaid balance.",
        "Let's check the payment date and reference before deciding on the next step.",
    ],
    [
        "refund_status",
        "Checking a Refund Timeline",
        "My refund has not arrived yet.",
        "Let's check the refund status and confirm the expected processing timeline.",
    ],
    [
        "password_reset",
        "Resetting a Forgotten Password",
        "I forgot my password and cannot sign in.",
        "Let's use the approved password recovery process to restore your access.",
    ],
    [
        "locked_account",
        "Recovering a Locked Account",
        "My account is locked after several sign-in attempts.",
        "Let's follow the secure account recovery steps and check the lockout status.",
    ],
    [
        "unrecognized_login",
        "Responding to an Unrecognized Account Sign-In",
        "I received an alert about a sign-in I do not recognize.",
        "Let's follow the account security process and review how to secure your access.",
    ],
    [
        "third_party_access",
        "Helping a Caller Who Is Not the Account Holder",
        "I want to change the details on my partner's account.",
        "We need to confirm your authorization before discussing or changing account details.",
    ],
    [
        "no_connection",
        "Restoring a Lost Connection",
        "My internet connection stopped working.",
        "Let's check for a service outage, then work through the connection checks together.",
    ],
    [
        "slow_connection",
        "Investigating a Slow Connection",
        "My connection is much slower than usual.",
        "Let's check which devices are affected and run through the recommended connection checks.",
    ],
    [
        "app_crash",
        "Troubleshooting an App That Keeps Closing",
        "The app closes every time I try to open it.",
        "Let's confirm your app version and follow the recommended troubleshooting steps.",
    ],
    [
        "device_setup",
        "Guiding a First-Time Device Setup",
        "I need help setting up my new device.",
        "Let's follow the setup guide together, checking each step before moving on.",
    ],
    [
        "service_outage",
        "Setting Expectations During a Service Outage",
        "Everyone in my home has lost service.",
        "Let's check the outage information and explain the updates currently available.",
    ],
    [
        "repeat_issue",
        "Following Up When Troubleshooting Has Not Resolved a Recurring Problem",
        "I already called about this problem, and it keeps coming back.",
        "Let's review the previous troubleshooting and document the recurring issue for the support team.",
    ],
    [
        "explain_terms",
        "Explaining Technical Terms in Plain Language",
        "I do not understand the technical terms in your instructions.",
        "Let's go through the instructions in plain language, one step at a time.",
    ],
    [
        "long_wait",
        "Acknowledging a Long Wait",
        "I have been waiting a long time to speak to someone.",
        "Thank you for waiting. Let's focus on the issue you need help with today.",
    ],
    [
        "accessibility_support",
        "Adapting Support to a Customer's Communication Needs",
        "I need you to slow down and give me one instruction at a time.",
        "Of course. Let's use a pace and format that work for you, and check each step together.",
    ],
    [
        "change_plan",
        "Choosing a Different Service Plan",
        "I want to change to a plan that better fits my needs.",
        "Let's review your needs and compare the available plans, including their costs and terms.",
    ],
    [
        "cancel_service",
        "Handling a Service Cancellation Request",
        "I would like to cancel my service.",
        "Let's review the cancellation process, any applicable terms, and the next steps before you decide.",
    ],
];

function createSampleLesson([lesson_id, title, request, nextStep]) {
    const answer = (text, score) => ({
        text,
        scores: {
            compliance: score,
            process: score,
            communication: score,
            efficiency: score,
            outcome: score,
        },
    });

    return {
        lesson_id,
        title,
        starting_stage: "initial complaint",
        stages: {
            "initial complaint": {
                "customer responses": {
                    calm: request,
                    frustrated: `I need help with this. ${request}`,
                    angry: `This has been very frustrating! ${request}`,
                },
                answers: {
                    A: answer(
                        "I understand. Let me confirm the details using our approved process so I can help.",
                        95,
                    ),
                    B: answer("You will have to try again later.", 35),
                    C: answer("That does not sound like our problem.", 10),
                },
                pipWords: "",
                next_stage: "investigation",
            },
            investigation: {
                "customer responses": {
                    calm: "Thank you. What should we do next?",
                    frustrated: "I just want to know what happens next.",
                    angry: "I need a clear answer about what you can do!",
                },
                answers: {
                    A: answer(
                        "I guarantee everything will be fixed immediately.",
                        20,
                    ),
                    B: answer(nextStep, 95),
                    C: answer("Try checking the website yourself.", 35),
                },
                pipWords: "",
                next_stage: "resolution",
            },
            resolution: {
                "customer responses": {
                    calm: "I understand the next step now. Thank you.",
                    frustrated: "Okay, I understand what needs to happen next.",
                    angry: "Fine. Just make sure I know what to expect.",
                },
                answers: {
                    A: answer("Okay, goodbye.", 40),
                    B: answer("You should not need to call us again.", 15),
                    C: answer(
                        "Let's confirm the next steps and any available timeline. Is there anything else you need clarified?",
                        95,
                    ),
                },
                pipWords: "",
                next_stage: null,
            },
        },
    };
}

export const exampleLessons = [
    ...additionalScenarios.map(createSampleLesson),
    {
        lesson_id: "double_billing",
        title: "Double Billing Complaint",
        starting_stage: "initial complaint",
        stages: {
            "initial complaint": {
                "customer responses": {
                    calm: "Hi, I noticed I have been charged twice for my last month's bill",
                    frustrated:
                        "I can't believe I was charged twice for my last month's bill!",
                    angry: "This is unacceptable! I was charged twice for my last month's bill!",
                },
                answers: {
                    A: {
                        text: "I'm sorry about that, let me investigate. What's your name and birthday? ",
                        scores: {
                            compliance: 100,
                            process: 90,
                            communication: 95,
                            efficiency: 90,
                            outcome: 85,
                        },
                    },
                    B: {
                        text: "You'll need to contact billing.",
                        scores: {
                            compliance: 70,
                            process: 40,
                            communication: 30,
                            efficiency: 50,
                            outcome: 20,
                        },
                    },
                    C: {
                        text: "That's strange, we never do that.",
                        scores: {
                            compliance: 5,
                            process: 10,
                            communication: 15,
                            efficiency: 5,
                            outcome: 5,
                        },
                    },
                },
                pipWords:
                    "Ah, the customer is having a bad day... Listen carefully and acknowledge the concern. You got this!",
                next_stage: "investigation",
            },
            investigation: {
                "customer responses": {
                    calm: "Thanks for investigating for me. My name is Jane Doe and my birthday is January 10, 2000.",
                    frustrated:
                        "Well can't you just check for me? My name is Jane Doe and my birthday is January 10, 2000.",
                    angry: "I can clearly see that I was charged twice. Just do your job and check my account. My name is Jane Doe and my birthday is January 10, 2000.",
                },
                answers: {
                    A: {
                        text: "Oh I guess we did make a mistake. I'll fix that for you–-it should be resolved within a week. What else can I do for you?",
                        scores: {
                            compliance: 80,
                            process: 50,
                            communication: 30,
                            efficiency: 75,
                            outcome: 75,
                        },
                    },
                    B: {
                        text: "Oh haha what a silly mistake. Don't worry about it. Anything else you need?",
                        scores: {
                            compliance: 10,
                            process: 5,
                            communication: 5,
                            efficiency: 10,
                            outcome: 10,
                        },
                    },
                    C: {
                        text: "Ah it looks like we did double charge you last month. So sorry about that, I have put in a request to refund you the second charge. It should land in your bank account within the next week. Is there anything else I can help you with?",
                        scores: {
                            compliance: 90,
                            process: 90,
                            communication: 90,
                            efficiency: 90,
                            outcome: 95,
                        },
                    },
                },
                pipWords: "Good Job!",
                next_stage: "resolution",
            },
            resolution: {
                "customer responses": {
                    calm: "That's all from me, thank you!",
                    frustrated: "Uhh yeah that's everything I need I guess.",
                    angry: "That's all I need from you, yeah. I'm gonna get in contact with your manager next.",
                },
                answers: {
                    A: {
                        text: "Alright, have a great day!",
                        scores: {
                            compliance: 85,
                            process: 90,
                            communication: 80,
                            efficiency: 80,
                            outcome: 90,
                        },
                    },
                    B: {
                        text: "Okay, sounds good.",
                        scores: {
                            compliance: 60,
                            process: 30,
                            communication: 70,
                            efficiency: 70,
                            outcome: 60,
                        },
                    },
                    C: {
                        text: "Bye then.",
                        scores: {
                            compliance: 30,
                            process: 20,
                            communication: 10,
                            efficiency: 70,
                            outcome: 60,
                        },
                    },
                },
                pipWords: "YOU GOT THIS!!",
                next_stage: null,
            },
        },
    },
];
