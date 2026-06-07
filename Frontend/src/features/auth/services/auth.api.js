import axios from "axios"


const api = axios.create({
    baseURL: "https://gen-ai-project-f9zq.onrender.com",
    withCredentials: true
})

export async function register({ username, email, password }) {

    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })
        return response.data

    } catch (err) {
        console.log(err)
        throw err;
    }

}

export async function login({ email, password }) {

    try {

        const response = await api.post("/api/auth/login", {
            email, password
        })

        return response.data

    } catch (err) {
        console.log(err)
        throw err
    }

}

export async function logout() {
    try {

        const response = await api.get("/api/auth/logout")

        return response.data

    } catch (err) {

    }
}

export async function getMe() {

    try {

        const response = await api.get("/api/auth/get-me")

        return response.data

    } catch (err) {
        console.log(err)
    }

}

export async function updateProfile({contact, dob, bio, city, state, pincode, image}){
    try {
        const formData = new FormData();
      formData.append("bio", bio|| "");
      formData.append("contact", contact || "");
      formData.append("dob", dob || "");
      formData.append("city", city || "");
      formData.append("state", state|| "");
      formData.append("pincode", pincode || "");

      if (image) {
        formData.append("image", image);
        console.log("file: ", image)
      }
        const response = api.put('/api/auth/update', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
    } catch (error) {
        console.log(error)
    }
}