import http, { Server } from 'http';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import { default as toc } from 'markdown-toc';
import getPort from 'get-port';
import { DocsSection } from './Docs.types';
import {
  docsTemplate,
  docsStylesVariable,
  docsMarkupVariable,
} from './Docs.template';

export const Docs = new (class {
  #docsTemplate: string;
  #docsStyles: string;
  #docsMarkup: string;

  #httpHost: string;
  #httpPort: number;
  #httpServer: Server;
  #readmeContents?: string;
  #readmeSections?: DocsSection[];

  private parseReadmeContent = (): string => {
    if (!this.#readmeContents) {
      const readmePath = path.resolve(__dirname, '../../README.md');
      const readmeBuffer = fs.readFileSync(readmePath);
      this.#readmeContents = readmeBuffer.toString();
    }

    return this.#readmeContents as string;
  };

  #createDocsStyles = async (): Promise<void> => {
    const cssPath = require.resolve('github-markdown-css');
    const cssBuffer = fs.readFileSync(cssPath);
    this.#docsStyles = cssBuffer.toString();
  };

  #createDocsMarkup = async (): Promise<void> => {
    const readmeContent = this.parseReadmeContent();
    const flavouredResponse = await fetch('https://api.github.com/markdown', {
      method: 'POST',
      body: JSON.stringify({ text: readmeContent }),
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const flavouredMarkup = await flavouredResponse.text();

    this.#docsMarkup = flavouredMarkup.replace(
      /(?<=id=")(user-content-)(?=[A-Za-z0-9-]+")/gm,
      ''
    );
  };

  #renderDocsDocument = async (): Promise<string> => {
    if (this.#docsStyles) await this.#createDocsStyles();
    if (this.#docsMarkup) await this.#createDocsMarkup();

    return this.#docsTemplate
      .replace(docsStylesVariable, this.#docsStyles)
      .replace(docsMarkupVariable, this.#docsMarkup);
  };

  private parseReadmeSections = (): DocsSection[] => {
    if (!this.#readmeSections) {
      const readmeContent = this.parseReadmeContent();
      const readmeTree = toc(readmeContent).json;
      const optimizedReadmeTree = readmeTree.filter((node) => node.lvl > 1);

      this.#readmeSections = optimizedReadmeTree.map(({ content, slug }) => ({
        name: content,
        url: `http://${this.#httpHost}:${this.#httpPort}#${slug}`,
      }));
    }

    return this.#readmeSections as DocsSection[];
  };

  private createServer = async () => {
    this.#httpHost = 'localhost';
    this.#httpPort = await getPort({ port: 3000 });

    const docsContent = await this.#renderDocsDocument();

    this.#httpServer = http.createServer((request, response) => {
      response.writeHead(200);
      response.end(docsContent);
    });
  };

  public startServer = async () => {
    if (!this.#httpServer) await this.createServer();

    this.#httpServer.listen(this.#httpPort, this.#httpHost);
  };

  public stopServer = () => {
    if (this.#httpServer) this.#httpServer.close();
  };

  #create = async (): Promise<void> => {
    this.parseReadmeContent();
    this.parseReadmeSections();
    await this.#createDocsMarkup();
    await this.#createDocsStyles();
    await this.createServer();

    this.#httpServer.listen(this.#httpPort, this.#httpHost);
  };

  #destroy = async (): Promise<void> => {
    if (this.#httpServer) {
      this.#httpServer.close();
      this.#httpServer = null;
    }
  };

  public create = async (): Promise<void> => this.#create();

  constructor() {
    this.#docsTemplate = docsTemplate;
  }
})();
