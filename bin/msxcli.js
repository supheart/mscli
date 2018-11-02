#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');

// 定义默认的命令
program
  .version('0.1.0', '-v, --version')

// 定义二级命令
program.command('express <app-name>')
    .description('create a new project by express')
    .option('-p, --page', 'is a page project')
    .option('-s, --sql', 'is a sql project')
    .option('-u, --upload', 'is a upload project')
    .action(async (name, cmd) => {
        const options = await getOptionsByCmd(cmd);
        require('../lib/express')(name, options);
    });

program.command('koa <app-name>')
    .description('create a new project by koa')
    .option('-a, --page', 'is a page project')
    .option('-s, --sql', 'is a sql project')
    .option('-u, --upload', 'is a upload project')
    .action(async (name, cmd) => {
        const options = await getOptionsByCmd(cmd);
        require('../lib/koa')(name, options);
    });

async function getOptionsByCmd(cmd) {
    let options = {};
    let { page, sql, upload } = cmd;
    if (!cmd.page && !cmd.sql && !cmd.upload) {
        options = await inquirer.prompt([{
            name: 'ok',
            type: 'confirm',
            message: `is show option choose，default is no, using empyt option?`,
            default: false
        }]).then(result => {
            if( result.ok) {
                return inquirer.prompt([{
                    name: 'page',
                    type: 'confirm',
                    message: `is a page project?`,
                    default: false
                }]);
            }
            return { page: true, sql: true, upload: true };
        }).then(result => {
            if(result.page && result.sql && result.upload ) return result;
            page = result.page;
            if(result.page) {
                return inquirer.prompt([{
                    name: 'upload',
                    type: 'confirm',
                    message: `is a upload project?`,
                    default: false
                }, {
                    name: 'sql',
                    type: 'confirm',
                    message: `is a sql project?`,
                    default: false
                }]);
            } else {
                return inquirer.prompt([{
                    name: 'sql',
                    type: 'confirm',
                    message: `is a sql project?`,
                    default: false
                }]);
            }
        }).then(result => {
            return { page, upload, sql, ...result };
        }).catch((err) => {
            console.log(err);
            return { page, sql, upload }
        });
    } else {
        options = { page, sql, upload };
    }
    return options;
}

// 实现参数监听
program.parse(process.argv);