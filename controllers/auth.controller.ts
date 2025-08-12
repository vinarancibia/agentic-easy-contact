import { Request, Response } from "express";
import axios from 'axios';


export const addCodeWithGoogleAuthorization = async (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUriBack = process.env.GOOGLE_REDIRECT_URI;

    if( clientId && redirectUriBack ){
        const redirectUri = 'https://accounts.google.com/o/oauth2/v2/auth';
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUriBack,
            response_type: 'code',
            scope: 'https://www.googleapis.com/auth/calendar.events',
            access_type: 'offline',
            prompt: 'consent',
        });
        return res.redirect(`${redirectUri}?${params.toString()}`);
    }else return res.status(404).json({message: 'Se requiere un clientID y un redirectUri'})
}

export const addTokensWithCode = async (req: Request, res: Response) => {
    const { code } = req.query;
    console.log('CODE: ', code)
    if (!code) return res.status(400).send('No se recibió ningún código de autorización');

    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            },
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);
        console.log('Expira en:', expires_in, 'segundos');

        

        //? Seccion para guardar los tokens en DB

        const script = `
            <script>
              window.opener.postMessage({
                access_token: "${access_token}",
                refresh_token: "${refresh_token}"
              }, "http://localhost:3000");

              window.close();
            </script>
        `;
        res.send(script);

        // return res.send('¡Autenticación exitosa! Ahora puedes cerrar esta ventana.');
    } catch (err) {
        console.error('Error al intercambiar el código por tokens:', err);
        return res.status(500).send('Error al obtener tokens de Google');
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    
    const REFRESH_TOKEN = '' //! Extraer el refresh token de la DB
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: REFRESH_TOKEN,
            grant_type: 'refresh_token',
        },
    });
    
    const newAccessToken = response.data.access_token;
        
    } catch (error) {
        
    }
}