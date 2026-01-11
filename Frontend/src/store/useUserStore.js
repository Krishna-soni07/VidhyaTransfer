import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            onboardingData: {
                personalInfo: {
                    name: '',
                    email: '',
                    age: '',
                    country: '',
                    bio: '', // Added bio for profile
                    role: '', // Added role for profile
                    socials: {
                        linkedin: '',
                        instagram: '',
                        website: ''
                    }
                },
                skills: {
                    learning: [],
                    teaching: []
                },
                preferences: {
                    availability: '', // e.g., "Weekends", "Evenings"
                    mode: '', // e.g., "Online", "In-person"
                    goals: ''
                }
            },
            isOnboarded: false,

            setUser: (user) => set({ user }),

            updatePersonalInfo: (info) => set((state) => ({
                onboardingData: {
                    ...state.onboardingData,
                    personalInfo: { ...state.onboardingData.personalInfo, ...info }
                }
            })),

            updateSkills: (skills) => set((state) => ({
                onboardingData: {
                    ...state.onboardingData,
                    skills: { ...state.onboardingData.skills, ...skills }
                }
            })),

            updatePreferences: (prefs) => set((state) => ({
                onboardingData: {
                    ...state.onboardingData,
                    preferences: { ...state.onboardingData.preferences, ...prefs }
                }
            })),

            completeOnboarding: () => set({ isOnboarded: true }),

            resetOnboarding: () => set({
                isOnboarded: false,
                onboardingData: {
                    personalInfo: { name: '', email: '', age: '', country: '', bio: '', role: '', socials: { linkedin: '', instagram: '', website: '' } },
                    skills: { learning: [], teaching: [] },
                    preferences: { availability: '', mode: '', goals: '' }
                }
            })
        }),
        {
            name: 'user-storage', // unique name
        }
    )
);
