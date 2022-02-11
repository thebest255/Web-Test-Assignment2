type FilterArr = {
    name: string;
    onClick: Function;
}

type data = {
    login: string;
    avatar_url: string;
    type: string;
    id: number;
    html_url: string;
}

enum sort { "followers", "repositories", "joined", "bestMatch" }

type FetchFun = {
    login: string;
    page: number;
    sorting?: sort;
}

export type {
    FilterArr,
    data,
    FetchFun
}

export {
    sort
}