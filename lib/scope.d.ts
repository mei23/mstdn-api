declare type Scope = 'read' | 'write' | 'follow';
declare namespace Scope {
    const READ: Scope;
    const WRITE: Scope;
    const FOLLOW: Scope;
    const DEFAULT: Scope[];
    function from(x: any): Scope | null;
    function parse(str: string): Scope[];
}
export default Scope;
