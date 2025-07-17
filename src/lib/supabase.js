import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL ve Anon Key environment variables tanımlanmalı"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Veritabanı tabloları için yardımcı fonksiyonlar
export const supabaseService = {
  // Projeler
  async getProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async saveProjects(projects) {
    // Önce mevcut projeleri sil
    await supabase.from("projects").delete().neq("id", 0);

    // Yeni projeleri ekle
    const { data, error } = await supabase.from("projects").insert(
      projects.map((project) => ({
        title: project.title,
        image_url: project.imageUrl,
        demo_url: project.demoUrl,
        project_id: project.id,
      }))
    );

    if (error) throw error;
    return data;
  },

  // Site içeriği
  async getSiteContent() {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data?.content || null;
  },

  async saveSiteContent(content) {
    const { data, error } = await supabase.from("site_content").upsert({
      id: 1,
      content: content,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    return data;
  },

  // Form gönderileri
  async getFormSubmissions() {
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async saveFormSubmission(submission) {
    const { data, error } = await supabase.from("form_submissions").insert({
      name: submission.name,
      email: submission.email,
      message: submission.message,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
    return data;
  },

  async deleteFormSubmission(id) {
    const { error } = await supabase
      .from("form_submissions")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Real-time subscriptions
  subscribeToProjects(callback) {
    return supabase
      .channel('projects-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        callback
      )
      .subscribe();
  },

  subscribeToSiteContent(callback) {
    return supabase
      .channel('site-content-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'site_content' }, 
        callback
      )
      .subscribe();
  },

  subscribeToFormSubmissions(callback) {
    return supabase
      .channel('form-submissions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'form_submissions' }, 
        callback
      )
      .subscribe();
  },

  // Unsubscribe from real-time updates
  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  },
};
