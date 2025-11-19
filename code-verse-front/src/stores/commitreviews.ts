import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { GET_COMMIT_REVIEWS_ALL } from '@/lib/api/endpoints';
import api from '@/lib/api/config';

export type CommitReview = {
    id: number
    sha: string
    message: string
    suggested: string
    reviewBy: string
    reviewer: string
    createdAt: string
    updatedAt: string
    adherence: number
    adherence_comment: string
    vulnerability: number
    vulnerability_comment: string
    complexity_comment: string
    singleResponsibility: number
    singleResponsibility_comment: string
    openClosed: number
    openClosed_comment: string
    liskovSubstitution: number
    liskovSubstitution_comment: string
    interfaceSegregation: number
    interfaceSegregation_comment: string
    dependencyInversion: number
    dependencyInversion_comment: string
    repoOnUser: {
      gitName: string
      repoName: string
      repo: { name: string }
      gitUser: { gitName: string | null, userId: string | null }
    }
    // [key: string]: any
  }

// type CommitReview = {
//     id: number
//     sha: string
//     repoOnUser: {
//         repoName: string,
//         gitName: string,
//     }
//     createdAt: string
//     updatedAt: string
//     reviewBy: string
//     reviewer: string
//     message: string
//     suggested: string
//     adherence: number
//     adherence_comment: string
//     vulnerability: number
//     vulnerability_comment: string
//     complexity_comment: string
//     singleResponsibility: number
//     openClosed: number
//     liskovSubstitution: number
//     interfaceSegregation: number
//     dependencyInversion: number
//     singleResponsibility_comment: string
//     openClosed_comment: string
//     interfaceSegregation_comment: string
//     liskovSubstitution_comment: string
//     dependencyInversion_comment: string
// }

type ReposSelect = {
    label: string
    value: string
}
type GitNamesSelect = {
    label: string
    value: string
}
type ShaSelect = {
    label: string
    value: string
}

export const useCommitReviewStore = defineStore('commitreviews', {
    state: () => ({
        commitReviews: [] as CommitReview[],
        repos: [] as ReposSelect[],
        gitNames: [] as GitNamesSelect[],
        sha: [] as ShaSelect[],
    }),
    getters: {
        getCommitReviews: (state) => {
            return state.commitReviews
        },
        getRepos: (state) => {
            return state.repos
        },
        getGitNames: (state) => {
            return state.gitNames
        },
        getSha: (state) => {
            return state.sha
        },
        // param filters get review by list of repos, gitnames and between dates
        getFilteredCommitReviews: (state) => {
            return (repos: string[], gitNames: string[], startDate: string | undefined, endDate: string | undefined) => {
                return state.commitReviews.filter((review) => {
                    const reviewDate = new Date(review.createdAt);
                    return (
                      (repos.length === 0 || repos.includes(review.repoOnUser.repoName)) &&
                      (gitNames.length === 0 || gitNames.includes(review.repoOnUser.gitName)) &&
                      (!startDate || reviewDate >= new Date(startDate)) &&
                      (!endDate || reviewDate <= new Date(endDate))
                    )
                })
            }
        },
        getCommitReviewsBySha: (state) => {
            return (sha: string) => {
                return state.commitReviews.filter((review) => review.sha === sha)
            }
        }
      },
    actions: {
        async fetchCommitReviews(offset: number = 0, limit: number = 10, sha: string | undefined = undefined) {
            const params: { offset: number; limit: number; sha?: string } = {
                offset: offset,
                limit: limit,
            }
            if (sha) {
                params.sha = sha
            }
            const response = await api.get(GET_COMMIT_REVIEWS_ALL(),{
                params,
              }
            )
            return response.data
        },
        async allCommitReviews(sha: string | undefined = undefined) {
          // iterate until all data is fetched
          let offset = 0
          let limit = 1000
          let allCommitReviews: CommitReview[] = []
          let response = await this.fetchCommitReviews(offset, limit)
          allCommitReviews = allCommitReviews.concat(response.data)
          while (response.data.length > 0) {
            offset += limit
            response = await this.fetchCommitReviews(offset, limit)
            allCommitReviews = allCommitReviews.concat(response.data)
          }
          return allCommitReviews
        },
        async setCommitReviews() {
            const response = await this.allCommitReviews()
            this.commitReviews = response
            this.repos = Array.from(new Map(response.map((review: CommitReview) => [review.repoOnUser.repoName, { label: review.repoOnUser.repoName, value: review.repoOnUser.repoName }])).values());
            this.gitNames = Array.from(new Map(response.map((review: CommitReview) => [review.repoOnUser.gitName, { label: review.repoOnUser.gitName, value: review.repoOnUser.gitName }])).values());
            this.sha = Array.from(new Map(response.map((review: CommitReview) => [review.sha, { label: review.sha, value: review.sha }])).values());
        },
    }

});