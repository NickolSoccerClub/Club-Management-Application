// ---------------------------------------------------------------------------
// Grading Criteria & Descriptors – core data powering the grading interface
// Scale: 1-5 (1 = Basic, 3 = Competent, 5 = Expert for age group)
// ---------------------------------------------------------------------------

import type { BibColour } from "@/types/grading";

export interface CriteriaWithDescriptors {
  name: string;
  description: string;
  descriptors: { level: number; text: string }[];
}

export interface AgePhaseGrading {
  phase: "discovery" | "skill_acquisition" | "game_training";
  label: string;
  ageRange: string;
  criteria: CriteriaWithDescriptors[];
}

// =============================================================================
// Full grading criteria across all three age phases
// =============================================================================

export const GRADING_CRITERIA: AgePhaseGrading[] = [
  // ---------------------------------------------------------------------------
  // Discovery Phase – Ages 4-8 (U6-U9)
  // ---------------------------------------------------------------------------
  {
    phase: "discovery",
    label: "Discovery Phase",
    ageRange: "Ages 4-8 (U6-U9)",
    criteria: [
      {
        name: "Ball Familiarity",
        description: "Comfort and confidence with the ball at feet",
        descriptors: [
          { level: 1, text: "Avoids the ball or kicks it away. Rarely touches it voluntarily." },
          { level: 3, text: "Can stop and start with the ball. Uses one foot confidently." },
          { level: 5, text: "Confident with ball at both feet. Tries new moves and tricks naturally." },
        ],
      },
      {
        name: "Movement & Coordination",
        description: "Ability to move with and without the ball",
        descriptors: [
          { level: 1, text: "Struggles to run and control ball at the same time. Poor balance." },
          { level: 3, text: "Can move with the ball at a steady pace. Basic balance and coordination." },
          { level: 5, text: "Changes direction with ball at speed. Excellent balance and agility for age." },
        ],
      },
      {
        name: "Listening & Focus",
        description: "Ability to follow instructions and stay engaged",
        descriptors: [
          { level: 1, text: "Doesn't follow instructions. Easily distracted and wanders off." },
          { level: 3, text: "Follows instructions after repetition. Stays in the activity area." },
          { level: 5, text: "Listens first time. Stays focused throughout and helps others understand." },
        ],
      },
      {
        name: "Enthusiasm & Effort",
        description: "Energy, willingness to participate, and attitude",
        descriptors: [
          { level: 1, text: "Reluctant to participate. Low energy and needs constant encouragement." },
          { level: 3, text: "Participates when encouraged. Gives a reasonable effort throughout." },
          { level: 5, text: "Self-motivated and high energy. Encourages others and loves being there." },
        ],
      },
      {
        name: "Spatial Awareness",
        description: "Understanding of space and positioning relative to others",
        descriptors: [
          { level: 1, text: "Runs into other players. Clumps with the group with no sense of space." },
          { level: 3, text: "Generally finds space when reminded. Aware of other players nearby." },
          { level: 5, text: "Naturally finds open space. Avoids congestion and reads movement of others." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Skill Acquisition Phase – Ages 9-13 (U10-U14)
  // ---------------------------------------------------------------------------
  {
    phase: "skill_acquisition",
    label: "Skill Acquisition Phase",
    ageRange: "Ages 9-13 (U10-U14)",
    criteria: [
      {
        name: "First Touch",
        description: "Quality of receiving and controlling the ball from passes, aerial balls, and bouncing balls",
        descriptors: [
          { level: 1, text: "Ball regularly bounces off player. No cushioning and touch goes out of control." },
          { level: 3, text: "Controls ground passes reliably with dominant foot. Can receive on the move at moderate pace." },
          { level: 5, text: "Excellent touch across all surfaces. Controls aerial and driven balls cleanly. Sets ball into space with first touch under pressure." },
        ],
      },
      {
        name: "Passing Accuracy",
        description: "Ability to distribute the ball accurately over short and medium distances",
        descriptors: [
          { level: 1, text: "Passes rarely reach intended target. No weight or direction." },
          { level: 3, text: "Completes short passes reliably with dominant foot. Beginning to vary weight and angle." },
          { level: 5, text: "Consistently accurate with both feet at all distances. Disguises passes and plays through-balls effectively." },
        ],
      },
      {
        name: "Dribbling & Ball Control",
        description: "Ability to carry the ball past opponents and maintain close control in tight spaces",
        descriptors: [
          { level: 1, text: "Loses the ball immediately when challenged. Pushes ball too far ahead." },
          { level: 3, text: "Carries ball confidently at pace. Can beat a passive defender with a change of direction." },
          { level: 5, text: "Beats defenders consistently in 1v1. Uses multiple moves and maintains close control at speed in tight spaces." },
        ],
      },
      {
        name: "Shooting Technique",
        description: "Ability to strike the ball on goal with accuracy and appropriate technique",
        descriptors: [
          { level: 1, text: "Swings at the ball wildly. Misses target entirely with no power or accuracy." },
          { level: 3, text: "Strikes with laces or instep. Hits target from central areas with moderate power." },
          { level: 5, text: "Clinical finishing from various angles and distances. Can strike first time and place ball into corners under pressure." },
        ],
      },
      {
        name: "Defensive Positioning",
        description: "Understanding of where to be when out of possession and ability to win the ball back",
        descriptors: [
          { level: 1, text: "Stands still when team loses ball. No concept of goal-side positioning." },
          { level: 3, text: "Gets goal-side. Can jockey an opponent and makes basic tackles." },
          { level: 5, text: "Anticipates opposition play. Organises nearby teammates. Wins ball back and transitions to attack immediately." },
        ],
      },
      {
        name: "Game Awareness",
        description: "Ability to read the game, make decisions, and understand team shape",
        descriptors: [
          { level: 1, text: "Ball-watches constantly. No understanding of when to pass, dribble, or shoot." },
          { level: 3, text: "Scans occasionally. Makes reasonable decisions in unpressured situations." },
          { level: 5, text: "Constantly scans. Makes quick and effective decisions. Sees passes others miss and manipulates space." },
        ],
      },
      {
        name: "Communication",
        description: "Verbal and non-verbal communication with teammates during play",
        descriptors: [
          { level: 1, text: "Silent on the pitch. Doesn't call for ball or interact with teammates." },
          { level: 3, text: "Calls for ball regularly. Gives basic directional calls to teammates." },
          { level: 5, text: "Vocal leader on the pitch. Directs play and provides constant information. Lifts the team." },
        ],
      },
      {
        name: "Work Rate & Attitude",
        description: "Effort level, commitment to team play, and response to setbacks",
        descriptors: [
          { level: 1, text: "Gives up easily. Jogs through sessions with poor body language." },
          { level: 3, text: "Steady effort throughout. Does what is asked with a neutral attitude." },
          { level: 5, text: "Relentless effort every session. Sets the standard for others and embraces challenges." },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // Game Training Phase – Ages 14+ (U15+)
  // ---------------------------------------------------------------------------
  {
    phase: "game_training",
    label: "Game Training Phase",
    ageRange: "Ages 14+ (U15+)",
    criteria: [
      {
        name: "First Touch",
        description: "Quality of receiving under full match pressure across all surfaces and situations",
        descriptors: [
          { level: 1, text: "Touch breaks down under any pressure. Ball regularly given away at first contact." },
          { level: 3, text: "Reliable first touch under moderate pressure. Can set ball for next action in most situations." },
          { level: 5, text: "Elite first touch in all match scenarios. Controls long diagonals and driven passes effortlessly. Touch creates time and space." },
        ],
      },
      {
        name: "Passing Accuracy",
        description: "Distribution quality across all ranges under full game pressure",
        descriptors: [
          { level: 1, text: "Passes consistently intercepted. No variation and gives ball away under pressure." },
          { level: 3, text: "Reliable over short and medium distances. Beginning to attempt longer passes and switches." },
          { level: 5, text: "Dictates play with passing. Delivers pin-point long passes and plays defence-splitting through-balls consistently." },
        ],
      },
      {
        name: "Dribbling & Ball Control",
        description: "Ability to carry and beat opponents in competitive match situations",
        descriptors: [
          { level: 1, text: "Loses possession immediately in 1v1. No confidence carrying ball under pressure." },
          { level: 3, text: "Beats opponents occasionally. Carries ball well in transition with a developing signature move." },
          { level: 5, text: "Dominant in 1v1 and 1v2 situations. Carries ball through lines of pressure and creates chances from nothing." },
        ],
      },
      {
        name: "Shooting Technique",
        description: "Finishing ability across all match situations including set pieces",
        descriptors: [
          { level: 1, text: "Rarely threatens goal. Shots off target or weak. Panics in front of goal." },
          { level: 3, text: "Scores regularly from good positions. Developing ability to finish from tighter angles." },
          { level: 5, text: "Scores from anywhere. Exceptional finishing under pressure including long-range strikes and free kicks." },
        ],
      },
      {
        name: "Defensive Positioning",
        description: "Tactical defensive understanding and ability to defend individually and as part of a unit",
        descriptors: [
          { level: 1, text: "Positionally poor. Gets beaten easily and doesn't track runners or cover teammates." },
          { level: 3, text: "Solid positional sense. Delays attackers well. Makes clean tackles and tracks back consistently." },
          { level: 5, text: "Dominant defender. Reads the game two steps ahead. Marshals the backline and is rarely beaten 1v1." },
        ],
      },
      {
        name: "Game Awareness",
        description: "Tactical intelligence, decision-making speed, and ability to influence the match",
        descriptors: [
          { level: 1, text: "Plays without thinking. No awareness of game state and makes repeated poor decisions." },
          { level: 3, text: "Good understanding of team shape. Makes correct decisions in most phases of play." },
          { level: 5, text: "Exceptional game intelligence. Controls the tempo. Sees the game before it happens and makes everyone around them better." },
        ],
      },
      {
        name: "Communication",
        description: "Leadership through verbal and non-verbal communication in competitive matches",
        descriptors: [
          { level: 1, text: "Invisible on the pitch. Doesn't communicate and is isolated from team play." },
          { level: 3, text: "Communicates regularly. Provides useful information to nearby teammates." },
          { level: 5, text: "Captain-level leader. Commands the pitch vocally and inspires teammates in critical moments." },
        ],
      },
      {
        name: "Work Rate & Attitude",
        description: "Professional mentality, consistency of effort, and leadership in competitive environments",
        descriptors: [
          { level: 1, text: "Goes missing in tough matches. Avoids responsibility and shows poor body language." },
          { level: 3, text: "Reliable effort across the full match. Does their job and responds to coaching." },
          { level: 5, text: "Elite mentality. Relentless in every match and training session. Thrives under pressure and sets the professional standard." },
        ],
      },
    ],
  },
];

// =============================================================================
// Bib colour configuration
// =============================================================================

export const BIB_COLOURS: BibColour[] = ["blue", "red", "green", "orange", "pink"];

export const BIB_COLOUR_HEX: Record<BibColour, string> = {
  blue: "#2563EB",
  red: "#DC2626",
  green: "#16A34A",
  orange: "#EA580C",
  pink: "#EC4899",
};

export const BIB_COLOUR_BG: Record<BibColour, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
};
