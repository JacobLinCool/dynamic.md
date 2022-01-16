# dynamic.md Specifiers

Specifiers are case-insensitive, but I recommend using upper-case for consistency.

## `%` File Content Extraction and Injection

`%` is used to extract and inject content from a file into the current file.

It will choose the appropriate handler type based on the file extension.

But you can also specify the handler type by using the following sub-specifiers:

### `%MD`

> Auto detected by extension: `.md`

This sub-specifier will extract the content of a Markdown file and parse it by `dynamic.md`, then inject the result into the current file.

#### `%MD` Usage

```md
<!-- X %MD [mardown file path] -->
```

#### `%MD` Example

Parse and inject the content of `some.md` into the current file:

```md
<!-- X %MD some.md -->
```

### `%JSON`

> Auto detected by extension: `.json`

This sub-specifier will parse the content of a JSON file and you can inject a certain value into the current file.

#### `%JSON` Usage

```md
<!-- X %JSON [JSON file path] [key] [indent:n] -->
```

#### `%JSON` Example

Extract the `name` property from `package.json`:

```md
<!-- X %JSON package.json name -->
```

Extract the whole content of `package.json` and indent it by 4 spaces:

```md
<!-- X %JSON package.json . indent:4 -->
```

### `%YAML`

> Auto detected by extension: `.yaml`, `.yml`

This sub-specifier will parse the content of a YAML file and you can inject a certain value into the current file.

#### `%YAML` Usage

```md
<!-- X %YAML [YAML file path] [key] [indent:n] -->
```

#### `%YAML` Example

Extract the `title` property from `test.yaml`:

```md
<!-- X %YAML test.yaml title -->
```

### `%TXT`

> Auto detected by extension: Not any of the above.

This sub-specifier will read the content of a file and inject it like a string into the current file.

#### `%TXT` Usage

```md
<!-- X %TXT [file path] -->
```

#### `%TXT` Example

Inject the content of `some.txt` into the current file:

```md
<!-- X %TXT some.txt -->
```

## `$` Command Execution and Injection

`$` is used to execute a command and inject the result into the current file.

Usage:

```md
<!-- X $ [command] -->
```

Example:

```md
<!-- X $ echo "Hello World!" -->
```

### `$$`

This sub-specifier will execute a JS command and inject the result into the current file.

#### `$$` Usage

```md
<!-- X $$ [expression] -->
```

#### `$$` Example

Inject the result of `12345 + 54321` into the current file:

```md
<!-- X $$ 12345 + 54321 -->
```

Using IIFE (Immediately Invoked Function Expression) to execute complex JS code:

```md
<!-- X $$ 
(() => { 
    function rand_string(len) {
        const dict = "abcdefghijklmnopqrstuvwxyz0123456789";
        let text = "";
        for (let i = 0; i < len; i++) {
            text += dict.charAt(Math.floor(Math.random() * dict.length));
        }
        return text;
    }

    return rand_string(32);
})() 
-->
```

## `^` URL Fetch and Injection

`^` is used to fetch and inject the content of a URL into the current file.

It will choose the appropriate handler type based on the `Content-Type` header of the response.

But you can also specify the handler type by using the following sub-specifiers:

### `^MD`

> Auto detected by `Content-Type` header: `text/markdown`

This sub-specifier will fetch the content of a Markdown URL and parse it by `dynamic.md`, then inject the result into the current file.

#### `^MD` Usage

```md
<!-- X ^MD [url] -->
```

#### `^MD` Example

Parse and inject the content of `https://example.com/README.md` into the current file:

```md
<!-- X ^MD https://example.com/README.md -->
```

### `^JSON`

> Auto detected by `Content-Type` header: `application/json`, `text/json`

This sub-specifier will fetch the content of a JSON URL and you can inject a certain value into the current file.

#### `^JSON` Usage

```md
<!-- X ^JSON [url] [key] [indent:n] -->
```

#### `^JSON` Example

Parse and inject the `name` property from `https://example.com/package.json` into the current file:

```md
<!-- X ^JSON https://example.com/package.json name -->
```

### `^YAML`

> Auto detected by `Content-Type` header: `application/yaml`, `text/yaml`

This sub-specifier will fetch the content of a YAML URL and you can inject a certain value into the current file.

#### `^YAML` Usage

```md
<!-- X ^YAML [url] [key] [indent:n] -->
```

#### `^YAML` Example

```md
<!-- X ^YAML https://example.com/test.yaml title -->
```

### `^TXT`

> Auto detected by `Content-Type` header: Not any of the above.

This sub-specifier will fetch the content of a URL and inject it like a string into the current file.

#### `^TXT` Usage

```md
<!-- X ^TXT [url] -->
```

#### `^TXT` Example

Inject the content of `https://example.com/` into the current file:

```md
<!-- X ^TXT https://example.com/ -->
```

## `X` Escape Specifier

This specifier will make the handler escape it (and remove the specifier).

### `X` Usage

```md
<!-- X [something] [that] [will] [be] [treated] [like] [a] [hackable] [thing] -->
```

### `X` Example

```md
<!-- X % package.json license -->
```
