// Enums
export enum ActivityType {
  BLENDED = 'BLENDED',
  SELF_PACED = 'SELF_PACED',
  WEBINAR = 'WEBINAR',
}

export enum ContentType {
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  INTERACTIVE = 'INTERACTIVE',
  QUIZ = 'QUIZ',
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
}

export enum ElementType {
  ACTIVITY = 'ACTIVITY',
  LESSON = 'LESSON',
  MODULE = 'MODULE',
}

export enum PrerequisiteType {
  COMPLETION = 'COMPLETION',
  DATE = 'DATE',
  SCORE = 'SCORE',
}

export enum QuestionType {
  ESSAY = 'ESSAY',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SHORT_ANSWER = 'SHORT_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE',
}

export enum RuleType {
  DATE = 'DATE',
  PERFORMANCE = 'PERFORMANCE',
  PROGRESS = 'PROGRESS',
}

// Interfaces
export interface Assessment {
  course: Course
  courseId: number
  description: string
  id: number
  plagiarismCheckEnabled: boolean
  randomizeQuestions: boolean
  showFeedback: boolean
  timeLimit: number
  title: string
}

export interface ContentItem {
  content: string
  contentType: ContentType
  course: Course
  createdAt: Date
  elementId: number
  id: number
  updatedAt: Date
}

export interface ContentReleaseRule {
  element: Course
  elementId: number
  endDate?: Date
  id: number
  ruleType: RuleType
  ruleValue: string
  startDate?: Date
}

export interface Course {
  assessments: Assessment[]
  childElements: Course[]
  content: string
  contentItems: ContentItem[]
  createdAt: Date
  description: string
  elementId: number
  elementType: ElementType
  id: number
  learnerProgresses: LearnerPathProgress[]
  learningActivities: LearningActivity[]
  parentElement?: Course
  parentElementId?: number
  pathCourses: PathCourse[]
  prerequisites: Prerequisite[]
  prerequisiteFor: Prerequisite[]
  releaseRules: ContentReleaseRule[]
  title: string
  updatedAt: Date
}

export interface CourseTemplate {
  createdDate: Date
  creatorId: string
  description: string
  id: number
  isPublic: boolean
  lastModifiedDate: Date
  templateName: string
}

export interface LearnerPathProgress {
  completionDate?: Date
  currentCourse: Course
  currentCourseId: number
  id: number
  lastActivityDate: Date
  learner: string
  learnerId: string
  learningPath: LearningPath
  overallProgress: number
  pathId: number
}

export interface LearningActivity {
  activityType: ActivityType
  element: Course
  elementId: number
  endDateTime: Date
  id: number
  maxParticipants: number
  startDateTime: Date
}

export interface LearningPath {
  creatorId: string
  description: string
  id: number
  learnerProgresses: LearnerPathProgress[]
  pathCourses: PathCourse[]
  pathName: string
}

export interface PathCourse {
  completionCriteria: string
  course: Course
  courseId: number
  id: number
  isMandatory: boolean
  learningPath: LearningPath
  orderIndex: number
  pathId: number
}

export interface Prerequisite {
  element: Course
  elementId: number
  id: number
  prerequisiteElement: Course
  prerequisiteElementId: number
  prerequisiteType: PrerequisiteType
  prerequisiteValue: string
}

export interface Question {
  correctAnswer: string
  id: number
  points: number
  questionText: string
  questionType: QuestionType
  quiz: Quiz
  quizId: number
}

export interface Quiz {
  id: number
  questions: Question[]
  title: string
}
