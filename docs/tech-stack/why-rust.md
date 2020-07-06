# Why Rust?

## Productivity

Rust provides a number of features that enables developers to work faster:

- Enums & structs allow complex domains to be correctly modelled easier than in many languages.
- The borrow checker prevents many common bugs, reducing debugging time and the cognitive load while developing.
- Its exhaustive pattern matching shortens the feedback loop when a developer forgets to handle a particular case.
- It provides a comprehensive set of data structures and iterator utilities in its standard library, and supports generics to add more should you need them.
- It's strict compiler reduces the need for certain types of testing and allows for fearless refactoring - you can be reasonably sure that when it compiles it'll run.
- When you make a change the compiler can guide you through all the places that you need to change.
- Its standard formatter means almost all Rust code follows the same code style, which helps with reading third party code.
- It provides tooling for documentation, which runs code examples as part of unit tests - almost all Rust library documentation looks the same and code examples are guaranteed to work.

These productivity benefits are enabled by a steeper learning curve. Rust has some features that can't currently be found in any other language, and developers may take a while to get up to speed on these.

The compiler should prove helpful while developers are on the learning curve: a developer can just make changes and the compiler will help to get the code compiling and make sure there's no bugs as far as it can. It won't prevent logic bugs, but that's no different from any other language.

Any learning curve should be eclipsed by the overall productivity gains as the learning curve is a one time cost (per developer) but the productivity gains last forever.

## Upskilling

For the team taking over maintenance and development of the project after Red Badger, developers will likely need to be upskilled. Thankfully, Rust has a lot of resources to help with this:

- [The Rust Programming Language](https://doc.rust-lang.org/book/) book is comprehensive, well written and freely available to everyone.
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/index.html) & [Rustlings](https://github.com/rust-lang/rustlings/) teach rust by guiding people through coding exercises.
- Comprehensive documentation of everything in the core language: the build tools, the standard library, the compiler error messages.
- A culture of documentation - all libraries have documentation and most major libraries have free online "books" that guide you through their use.

## Hiring

Hiring for Rust developers may be a different experience from hiring for other languages.

There are likely to be a lot of developers looking for Rust jobs - Rust has been consistently voted as the most loved language on Stack Overflow for the last 5 years, so it's definitely something developers like. Rust is a less established language, so there's a smaller pool of existing developers to hire, but developers looking for Rust jobs are likely to be highly skilled. Rust is unlikely to be an engineer's first language, so they've probably picked up a lot of skills and experience before they got to Rust.

The converse of there being a smaller pool of developers is that there's also a smaller pool of employers competing for those developers. Simply by offering Rust jobs, you can stand out amongst the crowd of companies with less interesting stacks.

## More resources

### The New Stack

https://thenewstack.io/microsoft-rust-is-the-industrys-best-chance-at-safe-systems-programming

> The main reason Microsoft is so enamored with Rust is that it is a memory-safe language, one with minimal runtime checking. Rust excels in creating correct programs. Correctness means, roughly, that a program is checked by the compiler for unsafe operations, resulting in fewer runtime errors.

### Microsoft Security Response Center

https://msrc-blog.microsoft.com/2020/04/29/the-safety-boat-kubernetes-and-rust/

> After a month, we all were comfortable enough that we were back up to full efficiency (in terms of how much code we could write). However, we noticed that we gained productivity in the sense that we didn't spend as much time manually checking specific conditions, like null pointers, or not having to debug as many problems.

### Red Badger Blog

https://blog.red-badger.com/now-is-a-really-good-time-to-make-friends-with-rust

### ThoughtWorks Technology Radar

https://assets.thoughtworks.com/assets/technology-radar-vol-22-en.pdf

> Rust is continuously gaining in popularity. We've had heated discussions about which is better, Rust or C++/Go, without a clear winner. However, we're glad to see Rust has improved significantly, with more built-in APIs being added and stabilized, including advanced async support, since we mentioned it in our previous Radar. In addition, Rust has also inspired the design of new languages. For example, the Move language on Libra borrows Rust's way of managing memory to manage resources, ensuring that digital assets can never be copied or implicitly discarded.

### Stack Overflow Blog

https://stackoverflow.blog/2020/06/05/why-the-developers-who-use-rust-love-it-so-much/
