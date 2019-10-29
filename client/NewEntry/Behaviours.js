const BEHAVIOURS = new Map([
  [
    "b1",
    {
      label: "Sleeping in Bed",
      subBehaviours: [],
      color: "#56CCF2"
    }
  ],
  [
    "b2",
    {
      label: "Sleeping in Chair",
      subBehaviours: [],
      color: "#56CCF2"
    }
  ],
  [
    "b3",
    {
      label: "Awake/Calm",
      subBehaviours: [],
      color: "#6FCF97"
    }
  ],
  [
    "b4",
    {
      label: "Positively Engaged",
      subBehaviours: ["Conversing/Singing", "Hugging/Hand Holding", "Smiling"],
      color: "#6FCF97"
    }
  ],
  [
    "b5",
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
    "b6",
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
    "b7",
    {
      label: "Exit Seeking",
      subBehaviours: [],
      color: "#864A28"
    }
  ],
  [
    "b8",
    {
      label: "Aggressive - Verbal",
      subBehaviours: ["Insults", "Swearing", "Screaming"],
      color: "#FEA3A3"
    }
  ],
  [
    "b9",
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
    "b10",
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
