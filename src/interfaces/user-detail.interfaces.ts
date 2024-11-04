import { Course } from './courses.interface'

/**
 * UserDetailInterfaces represents the detailed information of a user in the system.
 *
 * This interface includes:
 * - Basic user information (ID, username, name, email)
 * - Optional profile picture URL
 * - SkillsEntity: An array of user's skills, including proficiency level and endorsements
 * - Course Progress: Tracks the user's progress in various courses
 * - Achievements: Records the user's earned achievements
 * - Badges: Detailed information about badges earned by the user
 * - Certifications: Information about certifications obtained by the user
 *
 * Each property is carefully typed to ensure data consistency and to provide
 * a comprehensive view of a user's profile and progress within the system.
 */
export interface UserDetailInterfaces {
  userCode: string | number // Unique identifier for the user
  username: string // User's chosen username
  firstName: string // User's first name
  lastName: string // User's last name
  email: string // User's email address
  profilePictureUrl?: string // Optional URL to user's profile picture

  // Array of user's skills
  skills?: {
    skillId: string // Unique identifier for the skill
    skillName: string // Name of the skill
    description?: string // Optional description of the skill
    proficiencyLevel: 'Beginner' | 'Intermediate' | 'Expert' // User's proficiency in the skill
    selfAssessed: boolean // Whether the proficiency was self-assessed
    endorsements?: {
      // Optional array of endorsements for this skill
      endorserId: string | number // ID of the user who gave the endorsement
      endorsementDate: Date // Date when the endorsement was given
    }[]
  }[]

  // Array tracking user's progress in courses
  courseProgress?: {
    courseId: string | number // Unique identifier for the course
    progressPercentage: number // Percentage of course completion
    lastAccessDate: Date // Date when the user last accessed the course
  }[]

  // Array of user's achievements
  achievements?: {
    achievementId: string | number // Unique identifier for the achievement
    dateEarned: Date // Date when the achievement was earned
  }[]

  // Array of badges earned by the user
  badges?: {
    badgeId: string | number // Unique identifier for the badge
    badgeName: string // Name of the badge
    description: string // Description of the badge
    imageUrl: string // URL to the badge image
    dateEarned: Date // Date when the badge was earned
  }[]

  // Array of certifications obtained by the user
  certifications?: {
    certificationId: string | number // Unique identifier for the certification
    certificationName: string // Name of the certification
    description: string // Description of the certification
    dateEarned: Date // Date when the certification was earned
    expiryDate: Date // Date when the certification expires
  }[]
}
