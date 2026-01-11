/**
 * Supabase Client Configuration
 * Uses Supabase JS client for serverless-friendly database access
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
}

// Create Supabase client with service role key (for server-side operations)
const supabase = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null;

/**
 * Test Supabase connection
 */
async function testConnection() {
    if (!supabase) {
        console.warn('[Supabase] Client not initialized');
        return false;
    }
    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error && error.code === '42P01') {
            // Table doesn't exist yet - that's OK, connection works
            console.log('[Supabase] Connected (tables need to be created)');
            return true;
        }
        if (error) {
            console.error('[Supabase] Connection test error:', error.message);
            return false;
        }
        console.log('[Supabase] Connection successful');
        return true;
    } catch (error) {
        console.error('[Supabase] Connection failed:', error.message);
        return false;
    }
}

// =============================================
// USER OPERATIONS
// =============================================

const User = {
    async create({ linkedinId, email, name, headline, pictureUrl, accessToken }) {
        const { data, error } = await supabase
            .from('users')
            .upsert({
                linkedin_id: linkedinId,
                email,
                name,
                headline,
                picture_url: pictureUrl,
                access_token: accessToken,
                updated_at: new Date().toISOString()
            }, { onConflict: 'linkedin_id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async findByLinkedInId(linkedinId) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('linkedin_id', linkedinId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async findByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('users')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async markOnboardingComplete(id) {
        return this.update(id, { onboarding_complete: true });
    },

    async getWithProfile(id) {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (userError) throw userError;

        const { data: profile } = await supabase
            .from('company_profiles')
            .select('*')
            .eq('user_id', id)
            .single();

        return { ...user, ...profile };
    }
};

// =============================================
// COMPANY PROFILE OPERATIONS
// =============================================

const CompanyProfile = {
    async upsert(userId, profileData) {
        const { data, error } = await supabase
            .from('company_profiles')
            .upsert({
                user_id: userId,
                naics_codes: profileData.naicsCodes || [],
                certifications: profileData.certifications || [],
                past_agencies: profileData.pastAgencies || [],
                capabilities_statement: profileData.capabilitiesStatement || '',
                other_certifications: profileData.otherCertifications || '',
                business_type: profileData.businessType || '',
                zip_code: profileData.zipCode || '',
                veteran_status: profileData.veteranStatus || '',
                goods_or_services: profileData.goodsOrServices || '',
                company_name: profileData.companyName || '',
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async findByUserId(userId) {
        const { data, error } = await supabase
            .from('company_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
};

// =============================================
// CONTENT LIBRARY OPERATIONS
// =============================================

const ContentLibrary = {
    async create(userId, contentData) {
        const { data, error } = await supabase
            .from('content_library')
            .insert({
                user_id: userId,
                title: contentData.title || `Post - ${new Date().toLocaleDateString()}`,
                content: contentData.content,
                template_type: contentData.templateType || '',
                agency_target: contentData.agencyTarget || '',
                pain_point: contentData.painPoint || '',
                hashtags: contentData.hashtags || [],
                geo_optimized: contentData.geoOptimized || false
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async findByUserId(userId, options = {}) {
        let query = supabase
            .from('content_library')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (options.status) {
            query = query.eq('status', options.status);
        }
        if (options.limit) {
            query = query.limit(options.limit);
        }
        if (options.offset) {
            query = query.range(options.offset, options.offset + (options.limit || 50) - 1);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('content_library')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('content_library')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async toggleFavorite(id) {
        const current = await this.findById(id);
        if (!current) throw new Error('Content not found');

        return this.update(id, { is_favorite: !current.is_favorite });
    },

    async delete(id) {
        const { data, error } = await supabase
            .from('content_library')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getCount(userId) {
        const { count, error } = await supabase
            .from('content_library')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (error) throw error;
        return count || 0;
    },

    async search(userId, searchTerm) {
        const { data, error } = await supabase
            .from('content_library')
            .select('*')
            .eq('user_id', userId)
            .or(`content.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%,agency_target.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async getFavorites(userId) {
        const { data, error } = await supabase
            .from('content_library')
            .select('*')
            .eq('user_id', userId)
            .eq('is_favorite', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    }
};

// =============================================
// SCHEDULED POSTS OPERATIONS (for Calendar)
// =============================================

const ScheduledPosts = {
    async create({ userId, title, content, scheduledDate, libraryId }) {
        const { data, error } = await supabase
            .from('scheduled_posts')
            .insert({
                user_id: userId,
                title: title || 'Scheduled Post',
                content,
                scheduled_date: scheduledDate,
                library_id: libraryId || null,
                status: 'scheduled'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async findByUserId(userId, options = {}) {
        let query = supabase
            .from('scheduled_posts')
            .select('*')
            .eq('user_id', userId)
            .order('scheduled_date', { ascending: true });

        if (options.status) {
            query = query.eq('status', options.status);
        }
        if (options.fromDate) {
            query = query.gte('scheduled_date', options.fromDate);
        }
        if (options.toDate) {
            query = query.lte('scheduled_date', options.toDate);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('scheduled_posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('scheduled_posts')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateStatus(id, status) {
        return this.update(id, { status });
    },

    async delete(id) {
        const { data, error } = await supabase
            .from('scheduled_posts')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getUpcoming(userId, days = 7) {
        const fromDate = new Date().toISOString();
        const toDate = new Date();
        toDate.setDate(toDate.getDate() + days);

        return this.findByUserId(userId, {
            status: 'scheduled',
            fromDate,
            toDate: toDate.toISOString()
        });
    }
};

module.exports = {
    supabase,
    testConnection,
    User,
    CompanyProfile,
    ContentLibrary,
    ScheduledPosts
};
