export type ContentStore = {
    [key: string]: {
        timer?: NodeJS.Timeout,
        content: string
    }
}
