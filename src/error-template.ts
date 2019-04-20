const CanNotBeEmptyTemplate = (str: string) => `${str} can not be empty`
const OverrideTemplate = (str: string, oldValue: any, newValue: any) =>
    `attention: the old ${str} will overridy by the new one, old ${str}: ${oldValue}, new ${str}: ${newValue}`

export { CanNotBeEmptyTemplate, OverrideTemplate }
