import App from "./app.js";

const PORT = process.env.PORT || 3000;

App.listen(PORT,() => {
    console.log(`Corriendo en el puerto ${PORT}`);
});