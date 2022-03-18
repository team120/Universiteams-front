const API = process.env.NEXT_PUBLIC_API_URL
const VERSION = process.env.NEXT_PUBLIC_API_VERSION

const endPoints = {
    auth: {
        login: `${API}/api/${VERSION}/auth/login`,
        logout: `${API}/api/${VERSION}/auth/logout`,
        profile: `${API}/api/${VERSION}/auth/profile`,
    },
    institutions: {
        getInstitutions: () => `${API}/api/${VERSION}/institutions/`,
        getInstitution: (id: number) => `${API}/api/${VERSION}/institutions/${id}`,
    },
}

export default endPoints
