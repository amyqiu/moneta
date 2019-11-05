const BEHAVIOURS = new Map([
  [
    "Sleeping in Bed",
    {
      label: "Sleeping in Bed",
      subBehaviours: [],
      color: "#56CCF2"
    }
  ],
  [
    "Sleeping in Chair",
    {
      label: "Sleeping in Chair",
      subBehaviours: [],
      color: "#56CCF2"
    }
  ],
  [
    "Awake/Calm",
    {
      label: "Awake/Calm",
      subBehaviours: [],
      color: "#6FCF97"
    }
  ],
  [
    "Positively Engaged",
    {
      label: "Positively Engaged",
      subBehaviours: ["Conversing/Singing", "Hugging/Hand Holding", "Smiling"],
      color: "#6FCF97"
    }
  ],
  [
    "Noisy",
    {
      label: "Noisy",
      subBehaviours: [
        "Crying",
        "Words",
        "Grunting/Moaning",
        "Questions/Requests"
      ],
      color: "#F2C94C"
    }
  ],
  [
    "Restless",
    {
      label: "Restless",
      subBehaviours: [
        "Fidgeting/Pacing",
        "Exploring/Searching",
        "Rattling/Rocking"
      ],
      color: "#F2994A"
    }
  ],
  [
    "Exit Seeking",
    {
      label: "Exit Seeking",
      subBehaviours: [],
      color: "#864A28"
    }
  ],
  [
    "Aggressive - Verbal",
    {
      label: "Aggressive - Verbal",
      subBehaviours: ["Insults", "Swearing", "Screaming"],
      color: "#FEA3A3"
    }
  ],
  [
    "Aggressive - Physical",
    {
      label: "Aggressive - Physical",
      subBehaviours: [
        "Biting",
        "Kicking",
        "Grabbing/Pulling",
        "Punching/Pushing",
        "Throwing",
        "Self-Injury"
      ],
      color: "#EB5757"
    }
  ],
  [
    "Aggressive - Sexual",
    {
      label: "Aggressive - Sexual",
      subBehaviours: [
        "Explicit Comments",
        "Public Masturbation",
        "Touching Others"
      ],
      color: "#9B51E0"
    }
  ]
]);

export default BEHAVIOURS;
