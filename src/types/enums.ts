export const enum PathExistsState {
    // Path does not exist
    None,
    // Path exists and is a file
    File,
    // Path exists and is a directory
    Dir,
    // Path exists, but is neither a file nor a directory
    Unknown
}
