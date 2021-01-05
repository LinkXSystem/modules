#include "basic.h"

int main()
{
    int pid = Fork();
    int x = 2;

    if (pid == 0)
    {
        printf("child: pid = %d, ppid = %d, x = %d\n", getpid(), getppid(), ++x);

        printf("child: pid = %d, ppid = %d, x = %d\n", getpid(), getppid(), ++x);

        exit(0);
    }

    printf("parent: pid = %d, ppid = %d, x = %d\n", getpid(), getppid(), --x);
}