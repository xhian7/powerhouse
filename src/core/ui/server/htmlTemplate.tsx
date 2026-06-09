import { type PropsWithChildren } from "react";

type htmlTemplateProps = {
    title: string
    customHeadChildren?: React.ReactNode
}

export function HtmlTemplate(props: PropsWithChildren<htmlTemplateProps>) {
    return <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/public/normalize.css" />
            <link rel="stylesheet" href="/public/styles.css" />
            <script defer src="/public/htmx.js"></script>
            {props.customHeadChildren}
            <title>{props.title}</title>
        </head>
        <body>
            {props.children}
        </body>
    </html>
}