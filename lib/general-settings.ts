import { supabase } from './supabase'

export interface GeneralSetting {
  id: string
  key: string
  value: string
}

/**
 * Fetch a single general setting by key
 */
export async function getGeneralSetting(key: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('general_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error) {
      console.error(`Error fetching general setting ${key}:`, error)
      return null
    }

    return data?.value || null
  } catch (error) {
    console.error(`Error fetching general setting ${key}:`, error)
    return null
  }
}

/**
 * Fetch multiple general settings by keys
 */
export async function getGeneralSettings(keys: string[]): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('general_settings')
      .select('key, value')
      .in('key', keys)

    if (error) {
      console.error('Error fetching general settings:', error)
      return {}
    }

    const settings: Record<string, string> = {}
    data?.forEach((setting) => {
      settings[setting.key] = setting.value
    })

    return settings
  } catch (error) {
    console.error('Error fetching general settings:', error)
    return {}
  }
}

