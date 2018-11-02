const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
// const mcliExpressTemp = require('mcli-express-temp');

async function create (projectName, options = {}) {
  // 模板文件夹路径
  const templatePath = path.resolve(__dirname, '..', 'node_modules', 'msxcli-koa-temp');
  const templateSrcPath = path.resolve(templatePath, 'src');
  // 生成项目的路径
  const appPath = path.resolve(process.cwd(), projectName);

  // 判断当前生成的路径时候已经内容
  if (fs.existsSync(appPath)) {
    await fs.remove(appPath);
  }
  // 新建目标文件夹
  fs.mkdirSync(appPath);

  const appSrcPath = path.resolve(appPath, 'src');
  fs.mkdirSync(appSrcPath);
  if (fs.existsSync(templateSrcPath)) {
    fs.copySync(templateSrcPath, appSrcPath);
    fs.copySync(path.resolve(templatePath, 'www'), path.resolve(appPath, 'www'));
    fs.copySync(path.resolve(templatePath, 'doc'), path.resolve(appPath, 'doc'));
    fs.copySync(path.resolve(templatePath, '.eslintrc'), path.resolve(appPath, '.eslintrc'));
    fs.copySync(path.resolve(templatePath, 'README.md'), path.resolve(appPath, 'README.md'));
    const packageContent = require(path.join(templatePath, 'package.json'));
    packageContent.name = projectName;
    packageContent.version = '0.1.0';
    let dependencies = packageContent.dependenciesType.base;
    if(options.sql) {
      dependencies = {...dependencies, ...packageContent.dependenciesType.sql};
    }
    if(options.page) {
      dependencies = {...dependencies, ...packageContent.dependenciesType.page};
    }
    if(options.upload) {
      dependencies = {...dependencies, ...packageContent.dependenciesType.upload};
    }
    packageContent.dependencies = dependencies;
    delete packageContent._from;
    delete packageContent._resolved;
    fs.writeFileSync(path.resolve(appPath, 'package.json'), JSON.stringify(packageContent, null, 2));
  } else {
    console.error(`Could not locate supplied template: ${chalk.green(templateSrcPath)}`);
    return;
  }

  let appFile = fs.readFileSync(path.resolve(appSrcPath, 'app.js'), 'utf8');
  let configFile = fs.readFileSync(path.resolve(appSrcPath, 'configs', 'index.js'), 'utf-8');

  if(!options.sql) {
    fs.removeSync(path.resolve(appSrcPath, 'views', 'sql.html'));
    fs.removeSync(path.resolve(appSrcPath, 'router', 'sql.js'));
    fs.removeSync(path.resolve(appSrcPath, 'public', 'js', 'sql.js'));
    fs.removeSync(path.resolve(appSrcPath, 'public', 'css', 'sql.css'));
    appFile = appFile.replace(/\/\/ @sql-on-begin([\s\S]*?)\/\/ @sql-on-end/gm, '').replace(/\n{3,}/gm, '\n\n').trim() + '\n';
    configFile = configFile.replace(/\/\/ @sql-on-begin([\s\S]*?)\/\/ @sql-on-end/gm, '').replace(/\n{3,}/gm, '').trim() + '\n';
  }

  if(!options.upload) {
    fs.removeSync(path.resolve(appSrcPath, 'views', 'upload.html'));
    fs.removeSync(path.resolve(appSrcPath, 'router', 'upload.js'));
    fs.removeSync(path.resolve(appSrcPath, 'uploads'));
    fs.removeSync(path.resolve(appSrcPath, 'public', 'js', 'upload.js'));
    fs.removeSync(path.resolve(appSrcPath, 'public', 'css', 'upload.css'));
    appFile = appFile.replace(/\/\/ @upload-on-begin([\s\S]*?)\/\/ @upload-on-end/gm, '').replace(/\n{3,}/gm, '\n\n').trim() + '\n';
    configFile = configFile.replace(/\/\/ @upload-on-begin([\s\S]*?)\/\/ @upload-on-end/gm, '').replace(/\n{3,}/gm, '').trim() + '\n';
  }

  if(!options.page) {
    fs.removeSync(path.resolve(appSrcPath, 'views'));
    fs.removeSync(path.resolve(appSrcPath, 'public'));
    appFile = appFile.replace(/\/\/ @template-on-begin([\s\S]*?)\/\/ @template-on-end/gm, '').replace(/\n{3,}/gm, '\n\n').trim() + '\n';
    configFile = configFile.replace(/\/\/ @template-on-begin([\s\S]*?)\/\/ @template-on-end/gm, '').replace(/\n{3,}/gm, '').trim() + '\n';

    let routerIndex = fs.readFileSync(path.resolve(appSrcPath, 'router', 'index.js'), 'utf8');
    let routerUser = fs.readFileSync(path.resolve(appSrcPath, 'router', 'user.js'), 'utf8');
    routerIndex = routerIndex.replace(/\/\/ @template-on-begin([\s\S]*?)\/\/ @template-on-end/gm, '').replace(/\n{3,}/gm, '\n\n').trim() + '\n';
    routerUser = routerUser.replace(/\/\/ @template-on-begin([\s\S]*?)\/\/ @template-on-end/gm, '').replace(/\n{3,}/gm, '\n\n').trim() + '\n';
    if(options.sql) {
      let routerSql = fs.readFileSync(path.resolve(appSrcPath, 'router', 'sql.js'), 'utf8');
      routerSql = routerSql.replace(/\/\/ @template-on-begin([\s\S]*?)\/\/ @template-on-end/gm, '').replace(/\n{3,}/gm, '\n\n').trim() + '\n';
      fs.writeFileSync(path.resolve(appSrcPath, 'router', 'sql.js'), routerSql);
    }
    fs.writeFileSync(path.resolve(appSrcPath, 'router', 'index.js'), routerIndex);
    fs.writeFileSync(path.resolve(appSrcPath, 'router', 'user.js'), routerUser);
  }
  
  fs.writeFileSync(path.resolve(appSrcPath, 'app.js'), appFile);
  fs.writeFileSync(path.resolve(appSrcPath, 'configs', 'index.js'), configFile);
}

module.exports = (...args) => {
  return create(...args).catch();
}
