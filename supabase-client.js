// Supabase client bootstrap for Gifty.
// Uses the public publishable key; never put a secret/service-role key here.
(function () {
  const url = 'https://gbibhnioinqbulzafqtf.supabase.co';
  const key = 'sb_publishable_aM5TDiypwkUKkDLvCjGe6Q_mZ3yafYt';
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = () => {
    window.giftySupabase = window.supabase.createClient(url, key);
    window.dispatchEvent(new Event('gifty-supabase-ready'));
  };
  script.onerror = () => console.error('Gifty: Supabase client failed to load.');
  document.head.appendChild(script);
})();
