export type ASTNode = {
  kind: string;
  name?: {
    kind: string;
    value: string;
    loc?: {
      start: number;
      end: number;
    };
  };
  interfaces?: Array<any>;
  directives?: Array<DirectiveNode>;
  fields?: Array<FieldDefinitionNode>;
  loc?: {
    start: number;
    end: number;
  };
};

export type DirectiveNode = {
  kind: string;
  name: {
    kind: string;
    value: string;
    loc?: {
      start: number;
      end: number;
    };
  };
  arguments?: Array<ArgumentNode>;
  loc?: {
    start: number;
    end: number;
  };
};

export type ArgumentNode = {
  kind: string;
  name: {
    kind: string;
    value: string;
    loc?: {
      start: number;
      end: number;
    };
  };
  value: {
    kind: string;
    values?: Array<ValueNode>;
    block?: boolean;
    loc?: {
      start: number;
      end: number;
    };
  };
  loc?: {
    start: number;
    end: number;
  };
};

export type ValueNode = {
  kind: string;
  value: string;
  block?: boolean;
  loc?: {
    start: number;
    end: number;
  };
};

export type FieldDefinitionNode = {
  kind: string;
  name: {
    kind: string;
    value: string;
    loc?: {
      start: number;
      end: number;
    };
  };
  arguments?: Array<any>;
  type: FieldDefinitionNodeType;
  directives?: Array<DirectiveNode>;
  loc?: {
    start: number;
    end: number;
  };
};

export type FieldDefinitionNodeType = {
  kind: string;
  type?: {
    kind: string;
    name?: {
      kind: string;
      value: string;
      loc?: {
        start: number;
        end: number;
      };
    };
    loc?: {
      start: number;
      end: number;
    };
  };
  loc?: {
    start: number;
    end: number;
  };
};
