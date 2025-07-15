
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'primereact/resources/themes/lara-dark-indigo/theme.css';  // puedes cambiar el tema
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faTrash, faEdit,faPlus  );
ReactDOM.createRoot(document.getElementById('root')!).render(
 // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
 // </React.StrictMode>
);
