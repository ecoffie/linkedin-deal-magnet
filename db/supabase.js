/**
 * Supabase Database Client & Models
 * LinkedIn Deal Magnet
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not found. Database features will be disabled.');
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

/**
 * Test database connection
 */
async function testConnection() {
    if (!supabase) {
        return { success: false, error: 'Supabase not configured' };
    }

    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) throw error;
        return { success: true, message: 'Database connected' };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * User Model
 */
const User = {
    async findByLinkedInId(linkedinId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('linkedin_id', linkedinId)
            .single();
        if (error && error.code !== 'PGRST116') console.error('User.findByLinkedInId error:', error);
        return data;
    },

    async findById(id) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        if (error) console.error('User.findById error:', error);
        return data;
    },

    async create(userData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();
        if (error) console.error('User.create error:', error);
        return data;
    },

    async update(id, updates) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('users')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) console.error('User.update error:', error);
        return data;
    },

    async upsertByLinkedInId(linkedinId, userData) {
        if (!supabase) return null;
        const existing = await this.findByLinkedInId(linkedinId);
        if (existing) {
            return this.update(existing.id, userData);
        }
        return this.create({ linkedin_id: linkedinId, ...userData });
    }
};

/**
 * Company Profile Model
 */
const CompanyProfile = {
    async findByUserId(userId) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('company_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error && error.code !== 'PGRST116') console.error('CompanyProfile.findByUserId error:', error);
        return data;
    },

    async create(profileData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('company_profiles')
            .insert([profileData])
            .select()
            .single();
        if (error) console.error('CompanyProfile.create error:', error);
        return data;
    },

    async update(userId, updates) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('company_profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .select()
            .single();
        if (error) console.error('CompanyProfile.update error:', error);
        return data;
    },

    async upsert(userId, profileData) {
        if (!supabase) return null;
        const existing = await this.findByUserId(userId);
        if (existing) {
            return this.update(userId, profileData);
        }
        return this.create({ user_id: userId, ...profileData });
    }
};

/**
 * Content Library Model
 */
const ContentLibrary = {
    async findByUserId(userId, options = {}) {
        if (!supabase) return [];
        let query = supabase
            .from('content_library')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (options.status) {
            query = query.eq('status', options.status);
        }
        if (options.isFavorite !== undefined) {
            query = query.eq('is_favorite', options.isFavorite);
        }
        if (options.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;
        if (error) console.error('ContentLibrary.findByUserId error:', error);
        return data || [];
    },

    async findById(id) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('content_library')
            .select('*')
            .eq('id', id)
            .single();
        if (error) console.error('ContentLibrary.findById error:', error);
        return data;
    },

    async create(contentData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('content_library')
            .insert([contentData])
            .select()
            .single();
        if (error) console.error('ContentLibrary.create error:', error);
        return data;
    },

    async update(id, updates) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('content_library')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) console.error('ContentLibrary.update error:', error);
        return data;
    },

    async delete(id) {
        if (!supabase) return false;
        const { error } = await supabase
            .from('content_library')
            .delete()
            .eq('id', id);
        if (error) console.error('ContentLibrary.delete error:', error);
        return !error;
    },

    async toggleFavorite(id) {
        const content = await this.findById(id);
        if (!content) return null;
        return this.update(id, { is_favorite: !content.is_favorite });
    },

    async search(userId, searchTerm) {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('content_library')
            .select('*')
            .eq('user_id', userId)
            .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false });
        if (error) console.error('ContentLibrary.search error:', error);
        return data || [];
    }
};

/**
 * Audit Model (for Phase 1 LinkedIn Optimizer)
 */
const Audit = {
    async create(auditData) {
        if (!supabase) return null;

        // First ensure audits table exists (it might not be in the old schema)
        const { data, error } = await supabase
            .from('audits')
            .insert([auditData])
            .select()
            .single();

        if (error) {
            // Table might not exist yet
            console.error('Audit.create error:', error);
            return null;
        }
        return data;
    },

    async findById(id) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('audits')
            .select('*')
            .eq('id', id)
            .single();
        if (error) console.error('Audit.findById error:', error);
        return data;
    },

    async findByEmail(email) {
        if (!supabase) return [];
        const { data, error } = await supabase
            .from('audits')
            .select('*')
            .eq('email', email)
            .order('created_at', { ascending: false });
        if (error) console.error('Audit.findByEmail error:', error);
        return data || [];
    },

    async countByEmail(email) {
        if (!supabase) return 0;
        const { count, error } = await supabase
            .from('audits')
            .select('*', { count: 'exact', head: true })
            .eq('email', email);
        if (error) console.error('Audit.countByEmail error:', error);
        return count || 0;
    }
};

/**
 * Scheduled Posts Model
 */
const ScheduledPost = {
    async findByUserId(userId, options = {}) {
        if (!supabase) return [];
        let query = supabase
            .from('scheduled_posts')
            .select('*')
            .eq('user_id', userId)
            .order('scheduled_date', { ascending: true });

        if (options.status) {
            query = query.eq('status', options.status);
        }
        if (options.startDate) {
            query = query.gte('scheduled_date', options.startDate);
        }
        if (options.endDate) {
            query = query.lte('scheduled_date', options.endDate);
        }

        const { data, error } = await query;
        if (error) console.error('ScheduledPost.findByUserId error:', error);
        return data || [];
    },

    async create(postData) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('scheduled_posts')
            .insert([postData])
            .select()
            .single();
        if (error) console.error('ScheduledPost.create error:', error);
        return data;
    },

    async update(id, updates) {
        if (!supabase) return null;
        const { data, error } = await supabase
            .from('scheduled_posts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        if (error) console.error('ScheduledPost.update error:', error);
        return data;
    },

    async delete(id) {
        if (!supabase) return false;
        const { error } = await supabase
            .from('scheduled_posts')
            .delete()
            .eq('id', id);
        if (error) console.error('ScheduledPost.delete error:', error);
        return !error;
    }
};

module.exports = {
    supabase,
    testConnection,
    User,
    CompanyProfile,
    ContentLibrary,
    Audit,
    ScheduledPost
};
