const APP_URL = "https://app.preachinghub.com";
const SIGNUP_URL = `${APP_URL}/auth/signup`;

// ─── Logo variants ────────────────────────────────────────────────────────────

// Color wordmark (dark text + blue "Hub") — for light backgrounds
function PHLogo({ height = 32 }: { height?: number }) {
  const w = (517.5 / 85.36) * height;
  return (
    <svg height={height} width={w} viewBox="0 0 517.5 85.36" xmlns="http://www.w3.org/2000/svg" aria-label="PreachingHub">
      <path fill="#231f20" d="M105.82,66.64V18.56h19.23c5.78,0,10.3,1.4,13.58,4.2,3.27,2.8,4.91,6.64,4.91,11.51,0,3.21-.73,5.99-2.2,8.36-1.47,2.37-3.59,4.2-6.36,5.48-2.78,1.29-6.08,1.93-9.92,1.93h-8.94v16.59h-10.29ZM116.12,37.43c0,2.18,1.77,3.95,3.95,3.95h4.38c2.71,0,4.81-.6,6.3-1.79,1.49-1.2,2.23-2.97,2.23-5.31s-.73-4.05-2.2-5.25c-1.47-1.2-3.58-1.79-6.33-1.79h-4.38c-2.18,0-3.95,1.77-3.95,3.95v6.25Z"/>
      <path fill="#231f20" d="M144.76,66.64V30.35h9.61l.34,10.56-.74-.2c.59-3.66,1.62-6.3,3.11-7.92,1.49-1.62,3.54-2.44,6.16-2.44h3.32v8.4h-3.32c-1.9,0-3.45.25-4.67.74-1.22.5-2.13,1.29-2.74,2.37-.61,1.08-.91,2.55-.91,4.4v20.38h-10.16Z"/>
      <path fill="#231f20" d="M183.09,67.45c-3.7,0-6.92-.78-9.65-2.34-2.73-1.56-4.85-3.76-6.36-6.6-1.51-2.84-2.27-6.18-2.27-10.02s.76-7.17,2.27-9.99c1.51-2.82,3.62-5.02,6.33-6.6,2.71-1.58,5.91-2.37,9.61-2.37s6.75.79,9.41,2.37c2.66,1.58,4.73,3.84,6.2,6.77,1.47,2.93,2.2,6.43,2.2,10.49v2.03h-25.53c.14,2.89.91,5.03,2.34,6.43,1.42,1.4,3.31,2.1,5.65,2.1,1.71,0,3.15-.36,4.3-1.08,1.15-.72,1.97-1.83,2.47-3.32l10.22.61c-.95,3.61-2.96,6.43-6.03,8.46-3.07,2.03-6.79,3.05-11.17,3.05ZM175.3,44.97h15.1c-.14-2.66-.87-4.65-2.2-5.96-1.33-1.31-3.06-1.96-5.18-1.96s-3.87.69-5.25,2.07-2.2,3.33-2.47,5.86Z"/>
      <path fill="#231f20" d="M214.17,67.45c-3.75,0-6.8-.87-9.17-2.61-2.37-1.74-3.55-4.16-3.55-7.28s1-5.68,3.01-7.41c2.01-1.74,4.98-3.01,8.9-3.83l11.71-2.3c0-2.35-.53-4.12-1.59-5.32-1.06-1.2-2.58-1.79-4.57-1.79s-3.45.44-4.54,1.32c-1.08.88-1.78,2.18-2.1,3.89l-10.22-.47c.68-3.97,2.47-6.98,5.38-9.04,2.91-2.05,6.74-3.08,11.48-3.08,5.42,0,9.49,1.29,12.22,3.86,2.73,2.57,4.1,6.34,4.1,11.31v12.39c0,1.04.17,1.73.51,2.07.34.34.85.51,1.52.51h1.02v6.97c-.32.09-.82.18-1.52.27-.7.09-1.39.14-2.07.14-1.45,0-2.79-.25-4.03-.74-1.24-.5-2.25-1.34-3.01-2.54-.77-1.2-1.15-2.9-1.15-5.11l.88.68c-.45,1.62-1.25,3.05-2.4,4.27s-2.64,2.17-4.47,2.84-3.94,1.02-6.33,1.02ZM216.6,60.48c1.67,0,3.14-.33,4.4-.98,1.26-.65,2.26-1.61,2.98-2.88.72-1.26,1.08-2.75,1.08-4.47v-1.76l-8.26,1.76c-1.62.32-2.86.85-3.69,1.59-.84.74-1.25,1.7-1.25,2.88s.41,2.17,1.22,2.84,1.99,1.02,3.52,1.02Z"/>
      <path fill="#231f20" d="M255.33,67.45c-3.7,0-6.93-.78-9.68-2.34-2.75-1.56-4.9-3.76-6.43-6.6-1.54-2.84-2.3-6.18-2.3-10.02s.77-7.17,2.3-9.99c1.53-2.82,3.68-5.02,6.43-6.6,2.75-1.58,5.98-2.37,9.68-2.37,3.2,0,6.08.57,8.63,1.69,2.55,1.13,4.61,2.75,6.2,4.87,1.58,2.12,2.55,4.67,2.91,7.65l-10.49.47c-.32-2.26-1.12-3.96-2.4-5.11-1.29-1.15-2.9-1.73-4.84-1.73-2.53,0-4.49.97-5.89,2.91-1.4,1.94-2.1,4.67-2.1,8.19s.7,6.26,2.1,8.23c1.4,1.96,3.36,2.95,5.89,2.95,1.94,0,3.57-.6,4.88-1.79,1.31-1.2,2.1-3.01,2.37-5.45l10.49.41c-.32,2.98-1.25,5.56-2.81,7.75-1.56,2.19-3.61,3.88-6.16,5.08-2.55,1.2-5.47,1.79-8.77,1.79Z"/>
      <path fill="#231f20" d="M274.63,66.64V18.56h10.16v20.24h-1.35c.36-2.12,1.07-3.86,2.13-5.21,1.06-1.35,2.39-2.37,3.99-3.05,1.6-.68,3.35-1.02,5.25-1.02,2.71,0,4.96.59,6.77,1.76,1.8,1.17,3.17,2.8,4.1,4.87.92,2.08,1.39,4.45,1.39,7.11v23.36h-10.16v-20.92c0-2.71-.42-4.74-1.25-6.09-.84-1.35-2.25-2.03-4.23-2.03s-3.7.7-4.87,2.1c-1.17,1.4-1.76,3.5-1.76,6.3v20.65h-10.16Z"/>
      <path fill="#231f20" d="M311.12,25.88v-8.12h10.49v8.12h-10.49ZM311.33,66.64V30.35h10.16v36.29h-10.16Z"/>
      <path fill="#231f20" d="M326.76,66.64V30.35h9.14l.41,10.63-1.29-.34c.36-2.71,1.09-4.87,2.2-6.5,1.11-1.62,2.49-2.8,4.16-3.52,1.67-.72,3.5-1.08,5.48-1.08,2.62,0,4.84.57,6.67,1.69,1.83,1.13,3.23,2.72,4.2,4.77.97,2.05,1.46,4.48,1.46,7.28v23.36h-10.16v-19.97c0-1.94-.16-3.59-.47-4.94-.32-1.35-.88-2.38-1.69-3.08-.81-.7-1.94-1.05-3.39-1.05-2.12,0-3.75.78-4.87,2.34-1.13,1.56-1.69,3.8-1.69,6.74v19.97h-10.16Z"/>
      <path fill="#231f20" d="M379.44,77.61c-3.48,0-6.38-.43-8.7-1.29-2.33-.86-4.18-2.05-5.55-3.59-1.38-1.54-2.34-3.3-2.88-5.28l10.43-.74c.36,1.17,1.05,2.1,2.07,2.78s2.56,1.02,4.64,1.02c2.44,0,4.3-.58,5.59-1.73,1.29-1.15,1.93-2.99,1.93-5.52v-3.86c-.86,1.67-2.23,3.01-4.13,4.03-1.9,1.02-4.02,1.52-6.36,1.52-2.98,0-5.62-.73-7.92-2.2-2.3-1.47-4.1-3.52-5.38-6.16s-1.93-5.74-1.93-9.31.64-6.54,1.93-9.21c1.29-2.66,3.07-4.75,5.35-6.26,2.28-1.51,4.89-2.27,7.82-2.27,2.66,0,4.91.59,6.74,1.76,1.83,1.17,3.22,2.73,4.16,4.67v-5.62h9.95v32.7c0,3.25-.74,5.95-2.23,8.09-1.49,2.14-3.57,3.76-6.23,4.84-2.66,1.08-5.75,1.62-9.28,1.62ZM379.37,57.43c2.35,0,4.21-.9,5.59-2.71,1.38-1.8,2.07-4.31,2.07-7.52,0-2.12-.3-3.95-.91-5.48-.61-1.53-1.49-2.71-2.64-3.52s-2.52-1.22-4.1-1.22c-2.44,0-4.33.93-5.69,2.78-1.35,1.85-2.03,4.33-2.03,7.45s.7,5.65,2.1,7.48c1.4,1.83,3.27,2.74,5.62,2.74Z"/>
      <path fill="#3760ad" d="M402.05,66.64V18.56h10.29v22.82l-4.54-3.25h27.35l-4.6,3.25v-22.82h10.29v48.07h-10.29v-23.09l4.6,3.25h-27.35l4.54-3.25v23.09h-10.29Z"/>
      <path fill="#3760ad" d="M456.97,67.45c-3.75,0-6.67-1.21-8.77-3.62-2.1-2.41-3.15-5.79-3.15-10.12v-23.36h10.16v20.99c0,2.8.43,4.84,1.29,6.13.86,1.29,2.21,1.93,4.06,1.93,2.08,0,3.69-.71,4.84-2.13,1.15-1.42,1.73-3.55,1.73-6.4v-20.52h10.16v36.29h-9.28l-.27-10.43,1.29.27c-.54,3.61-1.83,6.34-3.86,8.19-2.03,1.85-4.76,2.78-8.19,2.78Z"/>
      <path fill="#3760ad" d="M502.4,67.45c-2.53,0-4.73-.54-6.6-1.62-1.87-1.08-3.33-2.6-4.37-4.54l-.2,5.35h-9.68V18.56h10.16v16.93c.95-1.67,2.35-3.08,4.2-4.23,1.85-1.15,4.02-1.73,6.5-1.73,3.07,0,5.73.78,7.99,2.34,2.26,1.56,4.01,3.76,5.25,6.6,1.24,2.84,1.86,6.18,1.86,10.02s-.62,7.18-1.86,10.02c-1.24,2.84-2.99,5.04-5.25,6.6-2.26,1.56-4.92,2.34-7.99,2.34ZM499.55,59.66c2.26,0,4.07-.98,5.45-2.95,1.38-1.96,2.07-4.71,2.07-8.23s-.68-6.26-2.03-8.23c-1.35-1.96-3.16-2.95-5.42-2.95-1.67,0-3.1.44-4.3,1.32-1.2.88-2.1,2.16-2.71,3.83-.61,1.67-.91,3.68-.91,6.03s.3,4.29.91,5.96c.61,1.67,1.51,2.96,2.71,3.86,1.2.9,2.61,1.35,4.23,1.35Z"/>
      <rect fill="#3760ad" width="95.93" height="85.36"/>
      <path fill="white" d="M30.86,62.2v.03h.07v-.09l-.07.05ZM47.15,53.53v.02h4.68v-.02h-4.68ZM30.86,62.23h.07v-.09l-.07.05v.03ZM47.15,53.53v.02h4.68v-.02h-4.68Z"/>
      <polygon fill="white" points="73.7 20.58 73.7 62.23 47.15 62.23 47.15 62.27 30.86 73.24 30.86 62.23 30.93 62.23 30.93 62.15 33.76 60.25 43.72 53.54 51.83 53.54 51.83 53.53 64.99 53.53 64.99 29.29 30.93 29.29 30.93 62.15 30.86 62.2 30.86 62.23 22.23 62.23 22.23 20.58 73.7 20.58"/>
    </svg>
  );
}

// Light gray wordmark — for dark/blue backgrounds
function PHLogoGray({ height = 32 }: { height?: number }) {
  const w = (889.03 / 137.34) * height;
  return (
    <svg height={height} width={w} viewBox="0 0 889.03 137.34" xmlns="http://www.w3.org/2000/svg" aria-label="PreachingHub">
      <path fill="#e4e4e7" d="M153.76,95.1V9.24h34.34c10.32,0,18.4,2.5,24.25,7.5,5.84,5,8.77,11.85,8.77,20.56,0,5.72-1.31,10.7-3.93,14.93-2.62,4.23-6.41,7.5-11.37,9.8-4.96,2.3-10.86,3.45-17.72,3.45h-15.96v29.63h-18.38ZM172.14,42.93c0,3.9,3.16,7.06,7.06,7.06h7.81c4.84,0,8.59-1.07,11.25-3.2,2.66-2.14,3.99-5.3,3.99-9.49s-1.31-7.24-3.93-9.37c-2.62-2.14-6.39-3.2-11.31-3.2h-7.81c-3.9,0-7.06,3.16-7.06,7.06v11.15Z"/>
      <path fill="#e4e4e7" d="M223.31,95.1V30.28h17.17l.6,18.86-1.33-.36c1.05-6.53,2.9-11.25,5.56-14.15,2.66-2.9,6.33-4.35,11-4.35h5.93v15h-5.93c-3.39,0-6.17.44-8.34,1.33-2.18.89-3.81,2.3-4.9,4.23-1.09,1.94-1.63,4.56-1.63,7.86v36.4h-18.14Z"/>
      <path fill="#e4e4e7" d="M291.76,96.55c-6.61,0-12.36-1.39-17.23-4.17-4.88-2.78-8.67-6.71-11.37-11.79-2.7-5.08-4.05-11.04-4.05-17.9s1.35-12.8,4.05-17.84c2.7-5.04,6.47-8.97,11.31-11.79,4.84-2.82,10.56-4.23,17.17-4.23s12.05,1.41,16.81,4.23c4.76,2.82,8.44,6.85,11.06,12.09,2.62,5.24,3.93,11.49,3.93,18.74v3.63h-45.59c.24,5.16,1.63,8.99,4.17,11.49,2.54,2.5,5.9,3.75,10.1,3.75,3.06,0,5.62-.64,7.68-1.94,2.06-1.29,3.53-3.27,4.41-5.93l18.26,1.09c-1.69,6.45-5.28,11.49-10.76,15.12-5.48,3.63-12.13,5.44-19.95,5.44ZM277.85,56.4h26.97c-.24-4.76-1.55-8.3-3.93-10.64-2.38-2.34-5.46-3.51-9.25-3.51s-6.91,1.23-9.37,3.69c-2.46,2.46-3.93,5.95-4.41,10.46Z"/>
      <path fill="#e4e4e7" d="M347.26,96.55c-6.69,0-12.15-1.55-16.39-4.66-4.23-3.1-6.35-7.44-6.35-13s1.79-10.14,5.38-13.24c3.59-3.1,8.89-5.38,15.9-6.83l20.92-4.11c0-4.19-.95-7.36-2.84-9.49-1.89-2.13-4.62-3.2-8.16-3.2s-6.17.79-8.1,2.36c-1.93,1.57-3.19,3.89-3.75,6.95l-18.26-.85c1.21-7.09,4.41-12.47,9.61-16.14,5.2-3.67,12.03-5.5,20.5-5.5,9.67,0,16.95,2.3,21.83,6.89,4.88,4.6,7.32,11.33,7.32,20.2v22.13c0,1.86.3,3.08.91,3.69.6.6,1.51.91,2.72.91h1.81v12.46c-.56.16-1.47.32-2.72.48-1.25.16-2.48.24-3.69.24-2.58,0-4.98-.44-7.2-1.33-2.22-.89-4.01-2.4-5.38-4.53-1.37-2.14-2.06-5.18-2.06-9.13l1.57,1.21c-.81,2.9-2.24,5.44-4.29,7.62-2.06,2.18-4.72,3.87-7.98,5.08s-7.03,1.81-11.31,1.81ZM351.62,84.09c2.98,0,5.6-.58,7.86-1.75,2.26-1.17,4.03-2.88,5.32-5.14,1.29-2.26,1.94-4.92,1.94-7.98v-3.14l-14.75,3.14c-2.9.56-5.1,1.51-6.59,2.84-1.49,1.33-2.24,3.04-2.24,5.14s.73,3.87,2.18,5.08,3.55,1.81,6.29,1.81Z"/>
      <path fill="#e4e4e7" d="M420.79,96.55c-6.61,0-12.38-1.39-17.29-4.17-4.92-2.78-8.75-6.71-11.49-11.79-2.74-5.08-4.11-11.04-4.11-17.9s1.37-12.8,4.11-17.84c2.74-5.04,6.57-8.97,11.49-11.79,4.92-2.82,10.68-4.23,17.29-4.23,5.72,0,10.86,1.01,15.42,3.02,4.55,2.02,8.24,4.92,11.06,8.71,2.82,3.79,4.55,8.34,5.2,13.66l-18.74.85c-.56-4.03-2-7.07-4.29-9.13-2.3-2.06-5.18-3.08-8.65-3.08-4.52,0-8.02,1.73-10.52,5.2-2.5,3.47-3.75,8.34-3.75,14.63s1.25,11.19,3.75,14.69c2.5,3.51,6,5.26,10.52,5.26,3.47,0,6.37-1.07,8.71-3.2,2.34-2.13,3.75-5.38,4.23-9.73l18.74.73c-.57,5.32-2.24,9.94-5.02,13.85-2.78,3.91-6.45,6.93-11,9.07-4.56,2.14-9.78,3.2-15.66,3.2Z"/>
      <path fill="#e4e4e7" d="M455.25,95.1V9.24h18.14v36.16h-2.42c.64-3.79,1.91-6.89,3.81-9.31,1.89-2.42,4.27-4.23,7.13-5.44,2.86-1.21,5.99-1.81,9.37-1.81,4.84,0,8.87,1.05,12.09,3.14,3.22,2.1,5.66,5,7.32,8.71,1.65,3.71,2.48,7.94,2.48,12.7v41.72h-18.14v-37.37c0-4.84-.75-8.47-2.24-10.88-1.49-2.42-4.01-3.63-7.56-3.63s-6.61,1.25-8.71,3.75c-2.1,2.5-3.14,6.25-3.14,11.25v36.88h-18.14Z"/>
      <path fill="#e4e4e7" d="M520.44,22.3V7.79h18.74v14.51h-18.74ZM520.8,95.1V30.28h18.14v64.82h-18.14Z"/>
      <path fill="#e4e4e7" d="M548.37,95.1V30.28h16.33l.73,18.99-2.3-.6c.64-4.84,1.95-8.71,3.93-11.61,1.97-2.9,4.45-5,7.44-6.29,2.98-1.29,6.25-1.94,9.8-1.94,4.67,0,8.65,1.01,11.91,3.02,3.27,2.02,5.76,4.86,7.5,8.53,1.73,3.67,2.6,8,2.6,13v41.72h-18.14v-35.67c0-3.47-.28-6.41-.85-8.83-.57-2.42-1.57-4.25-3.02-5.5-1.45-1.25-3.47-1.87-6.05-1.87-3.79,0-6.69,1.39-8.71,4.17-2.02,2.78-3.02,6.79-3.02,12.03v35.67h-18.14Z"/>
      <path fill="#e4e4e7" d="M642.45,114.69c-6.21,0-11.39-.77-15.54-2.3-4.15-1.53-7.46-3.67-9.92-6.41-2.46-2.74-4.17-5.89-5.14-9.43l18.62-1.33c.64,2.1,1.87,3.75,3.69,4.96s4.57,1.81,8.28,1.81c4.35,0,7.68-1.03,9.98-3.08,2.3-2.06,3.45-5.34,3.45-9.86v-6.89c-1.53,2.98-3.99,5.38-7.38,7.19-3.39,1.81-7.18,2.72-11.37,2.72-5.32,0-10.04-1.31-14.15-3.93-4.11-2.62-7.32-6.29-9.61-11s-3.45-10.26-3.45-16.63,1.15-11.69,3.45-16.45c2.3-4.76,5.48-8.48,9.55-11.19,4.07-2.7,8.73-4.05,13.97-4.05,4.76,0,8.77,1.05,12.03,3.14,3.27,2.1,5.74,4.88,7.44,8.34v-10.04h17.78v58.41c0,5.8-1.33,10.62-3.99,14.45-2.66,3.83-6.37,6.71-11.13,8.65-4.76,1.94-10.28,2.9-16.57,2.9ZM642.33,78.65c4.19,0,7.52-1.61,9.98-4.84,2.46-3.22,3.69-7.7,3.69-13.42,0-3.79-.54-7.05-1.63-9.8-1.09-2.74-2.66-4.84-4.72-6.29s-4.49-2.18-7.32-2.18c-4.35,0-7.74,1.65-10.16,4.96-2.42,3.31-3.63,7.74-3.63,13.3s1.25,10.1,3.75,13.36c2.5,3.27,5.84,4.9,10.04,4.9Z"/>
      <path fill="#e4e4e7" d="M682.84,95.1V9.24h18.38v40.75l-8.1-5.8h48.86l-8.22,5.8V9.24h18.38v85.86h-18.38v-41.24l8.22,5.8h-48.86l8.1-5.8v41.24h-18.38Z"/>
      <path fill="#e4e4e7" d="M780.92,96.55c-6.69,0-11.91-2.16-15.66-6.47-3.75-4.31-5.62-10.34-5.62-18.08V30.28h18.14v37.49c0,5,.77,8.65,2.3,10.94,1.53,2.3,3.95,3.45,7.26,3.45,3.71,0,6.59-1.27,8.65-3.81,2.06-2.54,3.08-6.35,3.08-11.43V30.28h18.14v64.82h-16.57l-.48-18.62,2.3.48c-.97,6.45-3.27,11.33-6.89,14.63-3.63,3.31-8.51,4.96-14.63,4.96Z"/>
      <path fill="#e4e4e7" d="M862.06,96.55c-4.52,0-8.45-.97-11.79-2.9-3.35-1.94-5.95-4.64-7.8-8.1l-.36,9.55h-17.29V9.24h18.14v30.23c1.69-2.98,4.19-5.5,7.5-7.56,3.3-2.06,7.17-3.08,11.61-3.08,5.48,0,10.24,1.39,14.27,4.17,4.03,2.78,7.15,6.71,9.37,11.79,2.22,5.08,3.33,11.05,3.33,17.9s-1.11,12.82-3.33,17.9c-2.22,5.08-5.34,9.01-9.37,11.79-4.03,2.78-8.79,4.17-14.27,4.17ZM856.98,82.64c4.03,0,7.27-1.75,9.73-5.26,2.46-3.51,3.69-8.4,3.69-14.69s-1.21-11.19-3.63-14.69c-2.42-3.51-5.64-5.26-9.67-5.26-2.98,0-5.54.79-7.68,2.36-2.14,1.57-3.75,3.85-4.84,6.83-1.09,2.98-1.63,6.57-1.63,10.76s.54,7.66,1.63,10.64c1.09,2.98,2.7,5.28,4.84,6.89,2.14,1.61,4.66,2.42,7.56,2.42Z"/>
      <path fill="#e4e4e7" d="M22.53,108.55v.09h.18v-.23l-.18.14ZM64.99,85.93v.05h12.22v-.05h-12.22ZM22.53,108.64h.18v-.23l-.18.14v.09ZM64.99,85.93v.05h12.22v-.05h-12.22Z"/>
      <polygon fill="#e4e4e7" points="134.25 0 134.25 108.64 64.99 108.64 64.99 108.73 22.53 137.34 22.53 108.64 22.71 108.64 22.71 108.41 30.07 103.46 56.04 85.97 77.21 85.97 77.21 85.93 111.54 85.93 111.54 22.71 22.71 22.71 22.71 108.41 22.53 108.55 22.53 108.64 0 108.64 0 0 134.25 0"/>
    </svg>
  );
}

// ─── Shared icon helper ───────────────────────────────────────────────────────

function Icon({ d, size = 20, color = "currentColor", strokeWidth = 1.75 }: { d: string | string[]; size?: number; color?: string; strokeWidth?: number }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/"><PHLogo height={28} /></a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href={`${APP_URL}/auth/login`} className="hidden md:block text-sm text-slate-600 hover:text-slate-900 transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="text-sm bg-[#3760ad] hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Start free trial
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Cartoon mockups ──────────────────────────────────────────────────────────

function BrowserShell({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 overflow-hidden bg-white select-none" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="h-7 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="ml-3 flex-1 max-w-[200px] bg-white rounded border border-slate-200 h-4 flex items-center px-2 text-[9px] text-slate-400">{url}</div>
      </div>
      {children}
    </div>
  );
}

// Mini sidebar used inside mockups
function MockSidebar({ active }: { active: number }) {
  const items = ["Dashboard", "Sermon Builder", "Get Feedback", "Series", "Templates", "Team", "Coach"];
  return (
    <div className="w-28 bg-white border-r border-slate-100 p-2.5 shrink-0 flex flex-col gap-0.5">
      <div className="mb-2.5 px-1"><PHLogo height={13} /></div>
      {items.map((label, i) => (
        <div key={label} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[9px] ${i === active ? "bg-blue-50 text-[#3760ad] font-semibold" : "text-slate-400"}`}>
          <div className="w-1 h-1 rounded-full shrink-0" style={{ background: i === active ? "#3760ad" : "#cbd5e1" }} />
          {label}
        </div>
      ))}
    </div>
  );
}

function DashboardMockup() {
  return (
    <BrowserShell url="app.preachinghub.com">
      <div className="flex text-[10px]" style={{ minHeight: 320 }}>
        <MockSidebar active={0} />
        <div className="flex-1 p-4 overflow-hidden">
          <div className="text-sm font-bold text-slate-800 mb-0.5">Good morning.</div>
          <div className="text-[9px] text-slate-400 mb-4">Here&apos;s where things stand.</div>
          <div className="flex gap-3 mb-3">
            {/* Next sermon */}
            <div className="flex-1 rounded-xl border border-slate-200 p-3">
              <div className="text-[7px] font-bold uppercase tracking-widest text-[#3760ad] mb-1">Next Sermon</div>
              <div className="font-bold text-slate-800 text-[11px] leading-tight mb-0.5">Grace That Finds Us</div>
              <div className="text-[#3760ad] text-[9px] mb-2">Luke 15:11-32</div>
              <div className="flex items-center gap-3 mt-1">
                <div className="relative w-9 h-9 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5"/>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3760ad" strokeWidth="3.5" strokeDasharray="55 88" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-slate-700">62%</div>
                </div>
                <div>
                  <div className="text-[8px] text-slate-400 mb-1">Up next: Final Check</div>
                  <div className="h-5 px-3 bg-[#3760ad] rounded flex items-center text-white text-[8px] font-medium w-fit">Continue Prep →</div>
                </div>
              </div>
            </div>
            {/* Up next */}
            <div className="w-36 rounded-xl border border-slate-200 p-3">
              <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-2">Up Next</div>
              {[
                { step: "Final Check", sermon: "Grace That Finds Us", when: "Today", hot: true },
                { step: "Detailed Obs.", sermon: "The Lost Sheep", when: "2d", hot: false },
                { step: "Big Idea", sermon: "The Lost Coin", when: "5d", hot: false },
              ].map(({ step, sermon, when, hot }) => (
                <div key={step} className="flex items-start gap-1.5 mb-2 last:mb-0">
                  <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: hot ? "#f59e0b" : "#3760ad" }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-700 truncate">{step}</div>
                    <div className="text-[8px] text-slate-400 truncate">{sermon}</div>
                  </div>
                  <span className={`text-[8px] shrink-0 ${hot ? "text-amber-500 font-semibold" : "text-slate-400"}`}>{when}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-2 mb-3">
            {[["12", "Preached"], ["4", "Upcoming"], ["5", "Series"]].map(([n, l]) => (
              <div key={l} className="flex-1 rounded-lg border border-slate-100 bg-slate-50 py-1.5 text-center">
                <div className="font-bold text-slate-800 text-sm">{n}</div>
                <div className="text-[8px] text-slate-400">{l}</div>
              </div>
            ))}
          </div>
          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Sermon Builder", c: "#3760ad" },
              { label: "Series", c: "#0ea5e9" },
              { label: "Get Feedback", c: "#8b5cf6" },
              { label: "Templates", c: "#10b981" },
            ].map(({ label, c }) => (
              <div key={label} className="rounded-xl border border-slate-200 p-2 flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-5 h-5 rounded-md" style={{ background: c + "18" }}>
                  <div className="w-full h-full rounded-md" style={{ background: c + "30" }} />
                </div>
                <span className="text-[8px] text-slate-500 text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserShell>
  );
}

function FeedbackInputMockup() {
  return (
    <BrowserShell url="app.preachinghub.com/evaluate">
      <div className="flex text-[10px]" style={{ minHeight: 300 }}>
        <MockSidebar active={2} />
        <div className="flex-1 p-4 flex gap-3 overflow-hidden">
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="text-sm font-bold text-slate-800">Get Sermon Feedback</div>
            <div className="text-[9px] text-slate-400">Upload your sermon or paste your notes and receive structured coaching.</div>
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#3760ad]/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3760ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="font-semibold text-slate-600 text-[10px]">Drop your sermon here</div>
              <div className="text-[8px] text-slate-400">Upload a file, paste your notes, or record live</div>
              <div className="flex gap-1.5 mt-1">
                {["Paste Video Link", "Paste Text", "Upload File"].map(btn => (
                  <div key={btn} className="bg-white border border-slate-200 rounded px-2 py-1 text-[8px] text-slate-600 font-medium">{btn}</div>
                ))}
              </div>
            </div>
            <div className="h-7 bg-[#3760ad] rounded-lg flex items-center justify-center text-white text-[9px] font-semibold gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Get Feedback
            </div>
          </div>
          <div className="w-32 flex flex-col gap-2.5 shrink-0">
            <div className="rounded-xl border border-slate-200 p-2.5">
              <div className="font-semibold text-slate-700 mb-1.5 text-[9px]">What you&apos;ll receive</div>
              {[
                { icon: "★", label: "Your Biggest Win" },
                { icon: "◉", label: "Category Breakdown" },
                { icon: "↑", label: "Top Growth Areas" },
                { icon: "?", label: "Reflection Questions" },
                { icon: "~", label: "Pacing Analysis" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 py-0.5 text-[8px] text-slate-500">
                  <span className="text-[#3760ad] w-3 shrink-0 font-bold">{icon}</span>{label}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 p-2.5">
              <div className="font-semibold text-slate-700 mb-1.5 text-[9px]">Recent Reports</div>
              {["The Lost Sheep", "Grace Abounds", "Kingdom Come"].map(name => (
                <div key={name} className="text-[8px] text-slate-500 py-0.5 border-b border-slate-50 last:border-0 truncate">{name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserShell>
  );
}

function FeedbackReportMockup() {
  const pacingBars = [18,22,28,35,40,38,42,45,50,48,52,58,62,60,65,68,70,65,72,75,78,80,76,74,70,68,72,74,78,82,85,80,76,70,65,60,52,45,38,28];

  const categories = [
    { label: "Textual Faithfulness", text: "Textual grounding is solid. The cultural context you drew on landed well with the passage's original setting." },
    { label: "Big Idea Clarity", text: "Big idea was stated clearly and repeated well. A few supporting points could be connected back to it more directly." },
    { label: "Introduction Strength", text: "Strong opening tension. The hook created genuine curiosity and set up the passage naturally.", strong: true },
    { label: "Movement & Structure", text: "Clear three-movement flow. The transition into the body felt slightly abrupt — consider a stronger bridge from your hook." },
    { label: "Illustration & Clarity", text: "The prodigal retelling was fresh and vivid. The secondary illustration felt slightly disconnected from the main point.", strong: true },
    { label: "Application Design", text: "Application stayed general. Push toward one concrete, specific ask your listener can act on this week." },
    { label: "Conclusion & Tension Resolution", text: "The close landed well emotionally. The call to action could be stated more directly before the final image.", strong: true },
    { label: "Gospel Faithfulness", text: "The grace moment in the third movement was genuinely moving and theologically grounded. This is your strongest area." },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 overflow-hidden bg-white select-none text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="bg-[#3760ad] px-5 py-3.5">
        <div className="text-[7px] font-bold uppercase tracking-widest text-blue-200 mb-1">Sermon Feedback Report</div>
        <div className="text-white font-bold text-[13px] leading-tight">Grace That Finds Us</div>
        <div className="text-blue-200 text-[8px] mt-0.5">Luke 15:11-32 &middot; Jul 6, 2026 &middot; 38 min</div>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Your Biggest Win */}
        <div className="rounded-xl bg-green-50 border border-green-100 p-3">
          <div className="text-[7px] font-bold uppercase tracking-widest text-green-600 mb-1">Your Biggest Win</div>
          <div className="text-[9px] text-slate-700 leading-snug font-medium">Gospel clarity in the third movement.</div>
          <div className="text-[8px] text-slate-500 leading-snug mt-0.5">Your gospel turn was theologically grounded and emotionally resonant. Protect this instinct — it&apos;s the heart of your preaching.</div>
        </div>

        {/* Category Breakdown */}
        <div>
          <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-2">Category Breakdown</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {categories.map(({ label, text }) => (
              <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                <div className="font-semibold text-[#3760ad] mb-0.5 text-[8px]">{label}</div>
                <div className="text-[7.5px] text-slate-500 leading-snug">{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Growth Areas + Questions side by side */}
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Top Growth Areas</div>
            {[
              { label: "Application", tip: "Give one concrete, specific action your listener can take this week — tied directly to the text." },
              { label: "Engagement", tip: "Plan a deliberate re-engagement moment around the 20-minute mark to recapture attention." },
            ].map(({ label, tip }) => (
              <div key={label} className="flex gap-1.5 mb-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="w-0.5 bg-amber-400 rounded-full shrink-0" />
                <div>
                  <div className="font-semibold text-slate-700 text-[8px]">{label}</div>
                  <div className="text-[7.5px] text-slate-500 leading-snug mt-0.5">{tip}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-48 shrink-0">
            <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Questions Worth Considering</div>
            {[
              "What would it look like for someone in your congregation to live this text out by Thursday?",
              "Where did you feel most alive while preaching? What does that tell you about your calling?",
              "What single sentence best captures what you wanted people to leave with?",
            ].map((q, i) => (
              <div key={i} className="flex gap-1.5 mb-2 last:mb-0">
                <div className="w-3.5 h-3.5 rounded-full bg-[#3760ad]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#3760ad] text-[6px] font-bold">{i + 1}</span>
                </div>
                <div className="text-[7.5px] text-slate-500 leading-snug italic">{q}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pacing Analysis */}
        <div>
          <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Pacing Analysis <span className="text-slate-300 font-normal normal-case tracking-normal">(video &amp; audio submissions)</span></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-end gap-px h-12 mb-1.5">
              {pacingBars.map((h, i) => {
                const pct = h / 100;
                const color = pct > 0.72 ? "#3760ad" : pct > 0.45 ? "#93c5fd" : "#dbeafe";
                return <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: color }} />;
              })}
            </div>
            <div className="flex justify-between text-[7px] text-slate-300 mb-2">
              <span>0:00</span><span>19:00</span><span>38:00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {[{ c: "#3760ad", l: "High" }, { c: "#93c5fd", l: "Moderate" }, { c: "#dbeafe", l: "Low" }].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-1 text-[7px] text-slate-400">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />{l}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-[7px]">
                {[["Avg pace", "145 wpm"], ["Peak", "Min 28–35"], ["Pauses", "7"]].map(([k, v]) => (
                  <div key={k}><span className="text-slate-400">{k} </span><span className="font-semibold text-slate-600">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <div className="hero-badge inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#3760ad] text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3760ad] inline-block"></span>
          14-day free trial &middot; No credit card required
        </div>
        <h1 className="hero-h1 text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight mb-6" style={{ fontFamily: "Georgia, serif" }}>
          Preach better.<br />Every week.
        </h1>
        <p className="hero-sub text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          PreachingHub gives you structured sermon prep, coaching-quality feedback on every message, and team tools built for the rhythm of weekly ministry.
        </p>
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <a href={SIGNUP_URL} className="cta-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-4 rounded-xl text-base shadow-lg" style={{ backgroundColor: "#3760ad" }}>
            Get feedback on your last sermon
            <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="white" strokeWidth={2.5} />
          </a>
          <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">See how it works &darr;</a>
        </div>
        <p className="hero-cta text-xs text-slate-400" style={{ animationDelay: '0.52s' }}>Free for 14 days, then $19.99/month. Cancel any time.</p>
      </div>
      <div className="hero-mockup max-w-5xl mx-auto mt-14">
        <DashboardMockup />
      </div>
    </section>
  );
}

// ─── Social proof ─────────────────────────────────────────────────────────────

function SocialProof() {
  return (
    <section className="py-12 border-y border-slate-100 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">Used by preachers at churches across the country</p>
        <div className="flex items-center justify-center gap-10 flex-wrap opacity-40">
          {["Grace City", "Bethel Midtown", "Every Nation", "Reflection Church", "City Church"].map(name => (
            <span key={name} className="text-slate-600 font-semibold text-sm">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
      title: "Upload your last sermon",
      body: "Paste your notes, drop in a recording, or link a YouTube video. PreachingHub works with whatever you have — manuscript, bullet points, or audio.",
    },
    {
      num: "02",
      icon: ["M13 2 3 14h9l-1 8 10-12h-9z"],
      title: "Get coaching-quality feedback",
      body: "Receive detailed feedback across eight preaching dimensions: structure, content, application, illustration, gospel, delivery, engagement, and clarity. Real scores, not generic notes.",
    },
    {
      num: "03",
      icon: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
      title: "Prep your next sermon with a clear system",
      body: "Move through an eight-step prep workflow — from first observation to final rehearsal — with progress tracking, deadlines, and your full series history in one place.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16" data-animate="fade-up">
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            From last Sunday to next Sunday
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Most preachers finish a sermon and immediately start the next one with no feedback loop. PreachingHub closes that gap.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, i) => (
            <div key={step.num} data-animate="fade-up" data-delay={String(i * 120)}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3760ad]">
                  <Icon d={step.icon} size={20} color="#3760ad" />
                </div>
                <span className="text-3xl font-bold text-slate-100" style={{ fontFamily: "Georgia, serif" }}>{step.num}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: ["M13 2 3 14h9l-1 8 10-12h-9z"],
      label: "Instant Sermon Feedback",
      title: "Coaching on every sermon, not just the ones you pay for",
      body: "Upload a recording or paste your manuscript and get a detailed critique with scores across eight preaching categories — strengths, growth areas, reflection questions, and pacing analysis. In under a minute.",
      accent: "#3760ad", bg: "#eff6ff",
    },
    {
      icon: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
      label: "Sermon Builder",
      title: "A prep system built around the way preachers actually work",
      body: "Eight guided steps from first observation to final notes. Track your progress, set prep deadlines, organize by series, and keep your full preaching library in one place. No more lost outlines.",
      accent: "#0ea5e9", bg: "#f0f9ff",
    },
    {
      icon: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M16 3.5c1.5.8 2.5 2.3 2.5 4s-1 3.2-2.5 4"],
      label: "Preacher Profile",
      title: "Feedback shaped around what matters most to you",
      body: "Set up your preaching profile — your style, your church context, your growth goals — and every feedback report is calibrated to you. Not generic coaching. Coaching that knows who you are and where you're headed.",
      accent: "#8b5cf6", bg: "#f5f3ff",
    },
    {
      icon: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", "M3 10h2", "M19 7h2", "M19 11h2"],
      label: "Team Tools",
      title: "Lead your preaching team from a single dashboard",
      body: "Assign sermons to team members, manage the preaching calendar, track everyone's prep progress, and keep the Sunday schedule in one place. Built for lead pastors and preaching directors.",
      accent: "#10b981", bg: "#f0fdf4",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16" data-animate="fade-up">
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Everything a preacher needs.<br />Nothing they don&apos;t.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Built specifically for the weekly discipline of sermon preparation and preaching development.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={f.label} className="feature-card bg-white rounded-2xl border border-slate-200 p-7" data-animate="fade-up" data-delay={String(i * 100)}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: f.bg, border: `1px solid ${f.accent}25` }}>
                <Icon d={f.icon} size={20} color={f.accent} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: f.accent }}>{f.label}</p>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Feedback preview ─────────────────────────────────────────────────────────

function FeedbackPreview() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14" data-animate="fade-up">
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Real feedback. In minutes.
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Upload Sunday&apos;s sermon and see exactly where you thrived and where you have room to grow — scored across eight coaching categories, including a full pacing analysis.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div data-animate="slide-left" data-delay="100"><FeedbackInputMockup /></div>
          <div data-animate="slide-right" data-delay="200"><FeedbackReportMockup /></div>
        </div>
      </div>
    </section>
  );
}

// ─── Video ────────────────────────────────────────────────────────────────────

function VideoSection() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }} data-animate="fade-up">See it in action</h2>
        <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto" data-animate="fade-up" data-delay="100">
          Watch how a preacher goes from Sunday&apos;s sermon to a full feedback report and a prep plan for next week &mdash; in under five minutes.
        </p>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg shadow-slate-100 aspect-video bg-gradient-to-br from-slate-100 to-blue-50 flex flex-col items-center justify-center gap-4" data-animate="scale-up" data-delay="150">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl" style={{ backgroundColor: "#3760ad" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <p className="text-slate-400 text-sm font-medium">[ Explainer video coming soon ]</p>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function Pricing() {
  const included = [
    { icon: ["M13 2 3 14h9l-1 8 10-12h-9z"], text: "Unlimited sermon feedback reports" },
    { icon: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"], text: "Sermon Builder with 8-step prep workflow" },
    { icon: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"], text: "Series management & preaching history" },
    { icon: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6"], text: "Sermon templates (built-in + custom)" },
    { icon: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"], text: "Coaching portal & session tracking" },
    { icon: ["M3 4h18", "M3 8h18", "M3 12h18", "M3 16h18", "M3 20h18"], text: "Team dashboard & preaching calendar" },
    { icon: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"], text: "Sermon assignment for team members" },
    { icon: ["M12 20h9", "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"], text: "Idea Bank for illustrations & notes" },
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>Simple pricing</h2>
        <p className="text-lg text-slate-500 mb-12">One plan. Everything included. Cancel any time.</p>
        <div className="bg-white rounded-2xl border-2 shadow-xl shadow-blue-100/50 p-8 text-left" style={{ borderColor: "#3760ad33" }} data-animate="scale-up" data-delay="100">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>$19.99</span>
            <span className="text-slate-500 mb-2">/month</span>
          </div>
          <p className="text-sm font-semibold mb-8" style={{ color: "#3760ad" }}>Start free for 14 days &mdash; no credit card required</p>
          <ul className="space-y-3 mb-8">
            {included.map(({ icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center text-[#3760ad]">
                  <Icon d={icon} size={15} color="#3760ad" strokeWidth={2} />
                </div>
                {text}
              </li>
            ))}
          </ul>
          <a href={SIGNUP_URL} className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors" style={{ backgroundColor: "#3760ad" }}>
            Start your free trial
            <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="white" strokeWidth={2.5} />
          </a>
          <p className="text-xs text-slate-400 text-center mt-4">14 days free. Then $19.99/month. Cancel any time.</p>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }} data-animate="fade-up">What preachers are saying</h2>
        <p className="text-lg text-slate-500 mb-16 max-w-xl mx-auto" data-animate="fade-up" data-delay="100">Preachers using PreachingHub to sharpen their craft week after week.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { initials: "MP", name: "Pastor Marcus", church: "Grace City Church" },
            { initials: "RL", name: "Pastor Rachel", church: "Reflection Church" },
            { initials: "TW", name: "Pastor Thomas", church: "City Church" },
          ].map(({ initials, name, church }, i) => (
            <div key={name} className="testimonial-card bg-white rounded-2xl border border-slate-200 p-7 text-left" data-animate="fade-up" data-delay={String(i * 120)}>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">&ldquo;[ Testimonial coming soon ]&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: "#3760ad" }}>{initials}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400">{church}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24 px-6" style={{ backgroundColor: "#3760ad" }}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-10">
          <PHLogoGray height={36} />
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
          Your next sermon deserves real feedback.
        </h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
          Join preachers who use PreachingHub to prepare with more clarity, preach with more confidence, and grow every single week.
        </p>
        <a href={SIGNUP_URL} className="cta-btn-white inline-flex items-center gap-2 bg-white font-semibold px-8 py-4 rounded-xl text-base shadow-lg" style={{ color: "#3760ad" }}>
          Get feedback on your last sermon &mdash; free for 14 days
          <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="#3760ad" strokeWidth={2.5} />
        </a>
        <p className="text-blue-200 text-xs mt-5">No credit card required. $19.99/month after trial.</p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <PHLogoGray height={20} />
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href={`${APP_URL}/auth/login`} className="hover:text-white transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="hover:text-white transition-colors">Start free trial</a>
          <a href="mailto:support@preachinghub.com" className="hover:text-white transition-colors">Support</a>
        </div>
        <p className="text-slate-500 text-xs">&copy; 2026 PreachingHub. Built for preachers by preachers.</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <FeedbackPreview />
      <VideoSection />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
