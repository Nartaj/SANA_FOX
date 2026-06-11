import { supabase } from '../supabaseClient';

// 1. РЕГИСТРАЦИЯ
export const signUpUser = async (email: string, password: string, username: string) => {
  // Регистрируем пользователя в Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;

  // Если регистрация успешна, создаем ему профиль в нашей таблице profiles
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, username: username, score: 0 }]);
    
    if (profileError) throw profileError;
  }
  return data.user;
};

// 2. ВХОД (ЛОГИН)
export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
};

// 3. ПОЛУЧЕНИЕ ЛИДЕРБОРДА (Топ-10 игроков)
export const getLeaderboard = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, score')
    .order('score', { ascending: false }) // Сортируем от большего к меньшему
    .limit(10); // Берем только топ-10

  if (error) throw error;
  return data;
};

// 4. ОБНОВЛЕНИЕ ОЧКОВ ИГРОКА
export const updatePlayerScore = async (userId: string, newScore: number) => {
  const { error } = await supabase
    .from('profiles')
    .update({ score: newScore })
    .eq('id', userId);

  if (error) throw error;
};