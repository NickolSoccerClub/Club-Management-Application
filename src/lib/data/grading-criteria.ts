// ---------------------------------------------------------------------------
// Grading Criteria & Descriptors – core data powering the grading interface
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
          { level: 1, text: "Avoids the ball, rarely touches it, kicks it away when it comes" },
          { level: 3, text: "Will touch the ball but uncomfortable, uses only dominant foot" },
          { level: 5, text: "Can stop and start with ball, uses one foot confidently" },
          { level: 7, text: "Comfortable with ball, beginning to use both feet" },
          { level: 10, text: "Confident with ball at feet, uses both feet naturally, tries new moves" },
        ],
      },
      {
        name: "Movement & Coordination",
        description: "Ability to move with and without the ball",
        descriptors: [
          { level: 1, text: "Struggles to run and control ball simultaneously" },
          { level: 3, text: "Can move slowly with ball, often loses control" },
          { level: 5, text: "Can move with ball at walking pace, basic balance" },
          { level: 7, text: "Moves confidently at jogging pace, can change direction" },
          { level: 10, text: "Changes direction with ball at speed, excellent balance and agility" },
        ],
      },
      {
        name: "Listening & Focus",
        description: "Ability to follow instructions and stay engaged",
        descriptors: [
          { level: 1, text: "Doesn't follow instructions, easily distracted, wanders off" },
          { level: 3, text: "Follows simple instructions with individual attention" },
          { level: 5, text: "Follows instructions after repetition, stays in activity area" },
          { level: 7, text: "Listens well, follows multi-step instructions" },
          { level: 10, text: "Listens first time, stays focused throughout, helps others understand" },
        ],
      },
      {
        name: "Enthusiasm & Effort",
        description: "Energy, willingness to participate, and attitude",
        descriptors: [
          { level: 1, text: "Reluctant to participate, low energy, needs constant encouragement" },
          { level: 3, text: "Participates minimally, passive involvement" },
          { level: 5, text: "Participates when encouraged, average effort level" },
          { level: 7, text: "Enthusiastic, good effort, enjoys the activities" },
          { level: 10, text: "Self-motivated, high energy, encourages others, loves being there" },
        ],
      },
      {
        name: "Spatial Awareness",
        description: "Understanding of space and positioning relative to others",
        descriptors: [
          { level: 1, text: "Runs into other players, clumps with group, no sense of space" },
          { level: 3, text: "Beginning to recognise space but gravitates to the ball" },
          { level: 5, text: "Generally finds space when reminded by coach" },
          { level: 7, text: "Finds space independently, aware of other players" },
          { level: 10, text: "Naturally finds open space, avoids congestion, reads movement" },
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
          { level: 1, text: "Ball regularly bounces off player, no cushioning, touch goes out of control" },
          { level: 3, text: "Can stop the ball but it sits under feet, limited to one surface, needs multiple touches to control" },
          { level: 5, text: "Controls ground passes reliably with dominant foot, can receive on the move at moderate pace" },
          { level: 7, text: "Good first touch with both feet, can receive and set in one motion, handles firm passes well" },
          { level: 10, text: "Excellent touch across all surfaces, controls aerial and driven balls cleanly, sets ball into space with first touch under pressure" },
        ],
      },
      {
        name: "Passing Accuracy",
        description: "Ability to distribute the ball accurately over short and medium distances",
        descriptors: [
          { level: 1, text: "Passes rarely reach intended target, no weight or direction, kicks and hopes" },
          { level: 3, text: "Can pass to a stationary teammate over short distance, inconsistent weight" },
          { level: 5, text: "Completes short passes reliably with dominant foot, beginning to vary weight and angle" },
          { level: 7, text: "Passes accurately over short and medium range with both feet, can play into space for a moving teammate" },
          { level: 10, text: "Consistently accurate with both feet at all distances, disguises passes, plays through-balls and switches play effectively" },
        ],
      },
      {
        name: "Dribbling & Ball Control",
        description: "Ability to carry the ball past opponents and maintain close control in tight spaces",
        descriptors: [
          { level: 1, text: "Loses the ball immediately when challenged, pushes ball too far ahead, no change of pace" },
          { level: 3, text: "Can dribble in open space but loses ball under any pressure, limited to one direction" },
          { level: 5, text: "Carries ball confidently at pace, can beat a passive defender with a change of direction" },
          { level: 7, text: "Uses feints and changes of pace to beat opponents, comfortable in 1v1 situations, protects ball well" },
          { level: 10, text: "Beats defenders consistently in 1v1, uses multiple moves, maintains close control at speed in tight spaces" },
        ],
      },
      {
        name: "Shooting Technique",
        description: "Ability to strike the ball on goal with accuracy and appropriate technique",
        descriptors: [
          { level: 1, text: "Swings at the ball wildly, misses target entirely, no power or accuracy" },
          { level: 3, text: "Can kick towards goal from stationary position, limited accuracy, toe-pokes frequently" },
          { level: 5, text: "Strikes with laces or instep, hits target from central areas, moderate power" },
          { level: 7, text: "Shoots accurately with both feet, varies power and placement, can shoot on the move" },
          { level: 10, text: "Clinical finishing from various angles and distances, can strike first time, places ball into corners under pressure" },
        ],
      },
      {
        name: "Defensive Positioning",
        description: "Understanding of where to be when out of possession and ability to win the ball back",
        descriptors: [
          { level: 1, text: "Stands still when team loses ball, doesn't track runners, no concept of goal-side positioning" },
          { level: 3, text: "Makes effort to get back but often in wrong position, dives in to tackle" },
          { level: 5, text: "Gets goal-side, can jockey an opponent, makes basic tackles" },
          { level: 7, text: "Reads the game to intercept, positions body well, wins tackles cleanly, recovers quickly" },
          { level: 10, text: "Anticipates opposition play, organises nearby teammates, wins ball back and transitions to attack immediately" },
        ],
      },
      {
        name: "Game Awareness",
        description: "Ability to read the game, make decisions, and understand team shape",
        descriptors: [
          { level: 1, text: "Ball-watches constantly, no understanding of when to pass, dribble, or shoot" },
          { level: 3, text: "Recognises basic options but slow to decide, often makes the wrong choice" },
          { level: 5, text: "Scans occasionally, makes reasonable decisions in unpressured situations" },
          { level: 7, text: "Scans before receiving, picks the right option most of the time, understands team shape" },
          { level: 10, text: "Constantly scans, makes quick and effective decisions, sees passes others miss, manipulates space" },
        ],
      },
      {
        name: "Communication",
        description: "Verbal and non-verbal communication with teammates during play",
        descriptors: [
          { level: 1, text: "Silent on the pitch, doesn't call for ball, no interaction with teammates" },
          { level: 3, text: "Occasionally calls for ball but no other communication" },
          { level: 5, text: "Calls for ball regularly, gives basic directional calls to teammates" },
          { level: 7, text: "Communicates clearly and consistently, organises those around them, encourages teammates" },
          { level: 10, text: "Vocal leader on the pitch, directs play, provides constant information, lifts the team" },
        ],
      },
      {
        name: "Work Rate & Attitude",
        description: "Effort level, commitment to team play, and response to setbacks",
        descriptors: [
          { level: 1, text: "Gives up easily, jogs through sessions, complains or shows poor body language" },
          { level: 3, text: "Works hard in patches but fades, inconsistent effort, occasionally negative" },
          { level: 5, text: "Steady effort throughout, does what is asked, neutral attitude" },
          { level: 7, text: "Consistent high work rate, chases lost causes, positive attitude, coachable" },
          { level: 10, text: "Relentless effort every session, sets the standard for others, embraces challenges, first to help teammates" },
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
          { level: 1, text: "Touch breaks down under any pressure, ball regularly given away at first contact" },
          { level: 3, text: "Can control in space but touch lets them down when pressed, limited surfaces used" },
          { level: 5, text: "Reliable first touch under moderate pressure, can set ball for next action in most situations" },
          { level: 7, text: "Confident touch under pressure, uses chest, thigh, and both feet to kill the ball, sets attacking angles" },
          { level: 10, text: "Elite first touch in all match scenarios, controls long diagonals and driven passes effortlessly, touch creates time and space" },
        ],
      },
      {
        name: "Passing Accuracy",
        description: "Distribution quality across all ranges under full game pressure",
        descriptors: [
          { level: 1, text: "Passes consistently intercepted, no variation, gives ball away under pressure" },
          { level: 3, text: "Completes simple short passes but range and vision are limited, avoids risk" },
          { level: 5, text: "Reliable over short and medium distances, beginning to attempt longer passes and switches" },
          { level: 7, text: "Excellent range with both feet, plays penetrating passes, varies tempo effectively" },
          { level: 10, text: "Dictates play with passing, delivers pin-point long passes, plays defence-splitting through-balls consistently, world-class weight and timing" },
        ],
      },
      {
        name: "Dribbling & Ball Control",
        description: "Ability to carry and beat opponents in competitive match situations",
        descriptors: [
          { level: 1, text: "Loses possession immediately in 1v1, no confidence carrying ball under pressure" },
          { level: 3, text: "Can carry in open space but predictable, rarely attempts to beat a player" },
          { level: 5, text: "Beats opponents occasionally, carries ball well in transition, developing a signature move" },
          { level: 7, text: "Regularly beats players in 1v1, manipulates defenders with body feints, excellent close control at pace" },
          { level: 10, text: "Dominant in 1v1 and 1v2 situations, carries ball through lines of pressure, creates chances from nothing through individual skill" },
        ],
      },
      {
        name: "Shooting Technique",
        description: "Finishing ability across all match situations including set pieces",
        descriptors: [
          { level: 1, text: "Rarely threatens goal, shots off target or weak, panics in front of goal" },
          { level: 3, text: "Can score from clear chances but technique breaks down under pressure" },
          { level: 5, text: "Scores regularly from good positions, developing ability to finish from tighter angles" },
          { level: 7, text: "Clinical from various positions, strikes first time, volleys and headers on target, composed in front of goal" },
          { level: 10, text: "Scores from anywhere, exceptional finishing under pressure, long-range strikes, free kicks, instinctive goal-scorer" },
        ],
      },
      {
        name: "Defensive Positioning",
        description: "Tactical defensive understanding and ability to defend individually and as part of a unit",
        descriptors: [
          { level: 1, text: "Positionally poor, gets beaten easily, doesn't track runners or cover teammates" },
          { level: 3, text: "Understands goal-side principle but slow to react, commits to tackles too early" },
          { level: 5, text: "Solid positional sense, delays attackers well, makes clean tackles, tracks back consistently" },
          { level: 7, text: "Reads danger early, intercepts regularly, organises defensive line, wins aerial and ground duels" },
          { level: 10, text: "Dominant defender, reads the game two steps ahead, marshals the backline, wins ball and starts attacks, rarely beaten 1v1" },
        ],
      },
      {
        name: "Game Awareness",
        description: "Tactical intelligence, decision-making speed, and ability to influence the match",
        descriptors: [
          { level: 1, text: "Plays without thinking, no awareness of game state, makes repeated poor decisions" },
          { level: 3, text: "Recognises obvious situations but slow to react, limited understanding of team tactics" },
          { level: 5, text: "Good understanding of team shape, makes correct decisions in most phases of play" },
          { level: 7, text: "Reads the game quickly, manipulates space and tempo, understands pressing triggers and transition moments" },
          { level: 10, text: "Exceptional game intelligence, controls the tempo, sees the game before it happens, makes everyone around them better" },
        ],
      },
      {
        name: "Communication",
        description: "Leadership through verbal and non-verbal communication in competitive matches",
        descriptors: [
          { level: 1, text: "Invisible on the pitch, doesn't communicate, isolated from team play" },
          { level: 3, text: "Calls for ball occasionally but no organisational communication" },
          { level: 5, text: "Communicates regularly, provides useful information to nearby teammates" },
          { level: 7, text: "Organises teammates in and out of possession, clear and consistent communication, sets the tone" },
          { level: 10, text: "Captain-level leader, commands the pitch vocally, manages game situations through communication, inspires teammates in critical moments" },
        ],
      },
      {
        name: "Work Rate & Attitude",
        description: "Professional mentality, consistency of effort, and leadership in competitive environments",
        descriptors: [
          { level: 1, text: "Goes missing in tough matches, avoids responsibility, shows frustration or poor body language" },
          { level: 3, text: "Works hard when things go well but drops off when struggling, inconsistent commitment" },
          { level: 5, text: "Reliable effort across the full match, does their job, responds to coaching" },
          { level: 7, text: "Outstanding work rate every match, leads by example, recovers quickly from mistakes, drives the team forward" },
          { level: 10, text: "Elite mentality, relentless in every match and training session, sets the professional standard, thrives under pressure, ultimate team player" },
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
