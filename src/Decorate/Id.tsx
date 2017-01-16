import * as React from 'react';

/** Container module for decorators of React components. */
export module Decorate {

  /** Pool for globally unique identifiers. */
  class IdPool {

    /** Available identifiers. */
    private available: number[];

    /** The index of the last reserved identifier. */
    private index: number;

    /** Construct a new identifier pool. */
    constructor() {
      this.available = [];
      this.index = 1;
    }

    /**
     * Returns a globally unique identifier.
     *
     * @returns {number} a globally unique identifier
     */
    public reserve(): number {
      this.available.length || this.grow();
      return this.available.shift()
    }

    /**
     * Release a previously reserved identifier.
     * The specified id will be put back into the list of available identifiers.
     *
     * @param id the id to release
     */
    public release(id: number): void {
      this.available.push(id);
    }

    /**
     * Grow the list of available identifiers.
     */
    private grow(): void {
      this.available.push(this.index++);
    }
  }

  /**
   * A single instance of the identifier pool.
   *
   * @type {Decorate.IdPool} identifier pool type
   */
  const pool = new IdPool();

  /**
   * Decorate a React component in order to fill the dictionary of identifiers.
   *
   * @param fields the fields to generate unique identifiers for
   * @returns {(WrappedComponent:any)=>any} the component to decorate
   */
  export function id(...fields: string[]) {
    return function decorator(WrappedComponent : any): any {
      return class extends React.Component<any, any> {

        constructor(props: any) {
          super(props);
          this.state = {cache: {}, reserved: []};
        }

        public componentWillMount(): void {
          const reserved: number[] = fields.map((field) => pool.reserve());
          const cache: { [id: string]: string; } = fields.reduce((dictionary, field) => ({...dictionary, [field]: field + "-" + reserved[Object.keys(dictionary).length]}), {});
          this.setState({cache, reserved});
        }

        public componentWillUnmount(): void {
          this.state.reserved.forEach((id: number) => pool.release(id));
        }

        public render() {
          return <WrappedComponent {...this.props} id={this.state.cache}/>;
        }
      };
    }
  }
}


