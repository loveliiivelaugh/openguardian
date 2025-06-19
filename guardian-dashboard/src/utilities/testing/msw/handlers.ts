// src/mocks/handlers.js
import { http, HttpResponse, passthrough } from 'msw';
import { server } from './node';

const hostname = `http://localhost:8081/api/v1`;

const route = (endpoint: string) => (hostname + endpoint);

export const handlers = [
    // Intercept "GET https://example.com/user" requests...
    http.get(route("/pocketbase/list"), passthrough)
    // () => {
    //     // ...and respond to them using this JSON response.
    //     return HttpResponse.json({
    //         id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
    //         firstName: 'John',
    //         lastName: 'Maverick',
    //     })
    // }),
];

server.events.on('request:start', ({ request }) => {
    console.log('MSW intercepted:', request.method, request.url)
});