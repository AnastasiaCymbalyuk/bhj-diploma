/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    try {
        if (options.method === 'GET') {
            xhr.open(`${options.method}`, `${options.url}?mail=${options.data.email}&password=${options.data.password}`);
            xhr.send(options.data);
        } else {
            const formData = new FormData;
            formData.append('mail', `${options.data.mail}`);
            formData.append('password', `${options.data.password}`);
            xhr.open(`${options.method}`, `${options.url}`);
            xhr.send(formData);
        };
        xhr.onload = function() {
            if (xhr.status === 200) {
                options.callback(null, xhr.response);
            }
        }    
    } catch (error) {
        xhr.onerror = function() {
            if (xhr.status != 200) {
                options.callback(xhr.statusText);
            }
        };
    };
};
