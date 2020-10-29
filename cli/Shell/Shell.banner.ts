import boxen from 'boxen';
import gh from 'github-url-to-object';
import { name, repository } from '../../package.json';
import terminalLink from 'terminal-link';
import kleur from 'kleur';

/**
 * prints text into header banner above interactive shell output
 */
export const printShellBanner = (): void => {
  const { user, repo, https_url: url } = gh(repository);
  const link = terminalLink(`github.com/${user}/${repo}`, url, {
    fallback: () => `${user}/${repo}`,
  });

  const banner = `
 ${kleur.cyan().underline().bold(name)}
 ${kleur.gray().dim(link)}
`;

  console.log(
    boxen(banner, {
      align: 'center',
      borderStyle: {
        topLeft: '╭',
        topRight: '╮',
        bottomLeft: '╰',
        bottomRight: '╯',
        horizontal: '─',
        vertical: '│',
      },
      dimBorder: true,
      float: 'left',
      padding: {
        top: 0,
        bottom: 0,
        left: 3,
        right: 3,
      },
      margin: {
        top: 2,
        bottom: 1,
        left: 3,
        right: 3,
      },
    })
  );
};
