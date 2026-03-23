import { createClient } from '@supabase/supabase-js'

/**
 * PASO 1: CONFIGURACIÓN DE APIS EXTERNAS
 */
const API_URL: string = "https://jsonplaceholder.typicode.com";
const POST_ID_TO_SEARCH: number = 1;

/**
 * PASO 2: CONFIGURACIÓN DE SUPABASE
 */
const SUPABASE_URL: string = "https://gpkpwmviqnvopknmeofs.supabase.co"; 
const SUPABASE_KEY: string = "sb_publishable_nvxxyA9Lq1jYOhl5YhvFxQ_QFEiZGx7";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * PASO 3: INTERFACES (Contratos de datos)
 */
interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Interfaz de la base de datos
interface Voter {
  voter_id: number;
  full_name: string;
  curp: string;
  email: string;
  phone_number: string;
  is_verified: boolean;
}

/**
 * PASO 4: FUNCIONES DE JSONPLACEHOLDER (Retos anteriores)
 */
const fetchSinglePost = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`);
    const data: Post = await response.json();
    console.log("%c ✅ [JSONPlaceholder] Post:", "color: cyan", data.title);
  } catch (error) {
    console.error("Error en Post:", error);
  }
};

const fetchCommentsByPost = async (postId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);
    const data: Comment[] = await response.json();
    console.log(`%c ✅ [RETO] ${data.length} comentarios encontrados.`, "color: yellow");
    data.forEach(c => console.log(`   - Email: ${c.email}`));
  } catch (error) {
    console.error("Error en Comentarios:", error);
  }
};

/**
 * PASO 5: FUNCIÓN DE SUPABASE (base de datos real)
 */
const getVoters = async (): Promise<void> => {
  console.log("%c [SUPABASE] Consultando tabla 'voters'...", "color: #3ecf8e; font-weight: bold;");

  try {
    const { data, error } = await supabase
      .from('voters') // Nombre exacto de la tabla
      .select('*');

    if (error) throw error;

    const listaVoters: Voter[] = data as Voter[];

    if (listaVoters.length === 0) {
      console.warn("⚠️ La tabla 'voters' está vacía. Agrega un registro en el dashboard de Supabase.");
    } else {
      console.log("✅ Lista de Votantes recuperada:");
      console.table(listaVoters); // Muestra la tabla en la consola
    }
  } catch (error: any) {
    console.error("❌ Error de Supabase:", error.message);
  }
};

/**
 * PASO FINAL: EJECUCIÓN
 */
const runLaboratory = async () => {
  console.log("%c --- INICIO DEL LABORATORIO ---", "background: #222; color: #bada55; padding: 5px;");
  
  await fetchSinglePost(POST_ID_TO_SEARCH);
  await fetchCommentsByPost(POST_ID_TO_SEARCH);
  
  // Llamada a tu base de datos de Supabase
  await getVoters();
  
  console.log("%c --- FIN DEL LABORATORIO ---", "background: #222; color: #bada55; padding: 5px;");
};

runLaboratory();