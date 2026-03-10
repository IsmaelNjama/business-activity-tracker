import { BaseApiService } from "./baseApi"

import {Activity} from "@/types"


class ActivityApiService extends BaseApiService {
  async createActivity(activityData: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
    return this.request<Activity>('/activities', {
      method: 'POST',
      body: JSON.stringify(activityData)
    })
}
}


export const activityApiService = new ActivityApiService()
