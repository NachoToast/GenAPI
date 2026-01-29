declare module "typescript" {
    interface Node {
        // internal? I don't think so ;)
        jsDoc?: JSDoc[];
    }
}
