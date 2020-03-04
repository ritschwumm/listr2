import { ListrContext, ListrOptions, ListrTask } from './interfaces/listr.interface'
import { Listr } from './listr'

export class Manager <InjectCtx = ListrContext> {
  // tasks
  private tasks: ListrTask[] = []

  constructor (private options?: ListrOptions<InjectCtx>) {
    this.options = Object.assign({}, options)
  }

  public add <Ctx = InjectCtx> (tasks: ListrTask<Ctx>[], options?: ListrOptions<Ctx>): void {
    const newTask: ListrTask<Ctx> = {
      task: (ctx, task): Listr<Ctx> => task.newListr<Ctx>(tasks,options)
    }

    this.tasks = [...this.tasks, newTask]
  }

  public async runAll <Ctx = InjectCtx> (options?: ListrOptions<Ctx>): Promise<Ctx> {
    options = Object.assign(this.options, options)
    const ctx = await this.run<Ctx>(this.tasks, options)
    this.tasks = []
    return ctx
  }

  public newListr <Ctx = InjectCtx> (tasks: ListrTask<Ctx>[], options?: ListrOptions<Ctx>): Listr<Ctx> {
    return new Listr<Ctx>(tasks, options)
  }

  public run <Ctx = InjectCtx> (tasks: ListrTask<Ctx>[], options?: ListrOptions<Ctx>): Promise<Ctx> {
    return this.newListr<Ctx>(tasks, options).run()
  }

  // general utils
  public getRuntime (pipetime: number): string {
    return `${Math.round(Date.now() - pipetime) / 1000}s`
  }
}
